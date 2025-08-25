import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../../services/person/person';

interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
}

@Component({
  selector: 'app-person',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './person.html',
  styleUrls: ['./person.css']
})

export class PersonComponent implements OnInit {

  constructor(private readonly formBuilder: FormBuilder, private readonly personService: Person) {
    this.crearForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(0)]]
    });
    this.editarForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(0)]]
    });
  }

  persons: Persona[] = [];

  nuevaPersona: Persona = { id: 0, nombre: '', apellido: '', edad: 0 };
  personaSeleccionada: Persona | null = null;

  crearForm!: FormGroup;
  editarForm!: FormGroup;

  abrirEditar(persona: Persona): void {
    this.personaSeleccionada = { ...persona };
  }

  abrirEliminar(persona: Persona): void {
    this.personaSeleccionada = { ...persona };
  }

  ngOnInit(): void {
    this.getPersonsAll();
  }

  getPersonsAll(): void {
    this.personService.getAllPersons().subscribe({
      next: (dato) => {
        this.persons = dato;
      },
      error: (error) => {
        console.error('Error al obtener todas las personas:', error);
      }
    });
  }

  createPerson(): void {
    this.personService.createPerson(this.nuevaPersona).subscribe({
      next: (dato) => {
        this.persons.push(dato);
      },
      error: (error) => {
        console.error('Error al crear una persona:', error);
      }
    });
  }

  updatePerson(): void {
    if (!this.personaSeleccionada) return;
    this.personService.updatePerson(this.personaSeleccionada.id, this.personaSeleccionada).subscribe({
      next: (dato) => {
        this.getPersonsAll();
      },
      error: (error) => {
        console.error('Error al actualizar la persona:', error);
      }
    });
  }

  deletePerson(): void {
    if (!this.personaSeleccionada) return;
    this.personService.deletePerson(this.personaSeleccionada.id).subscribe({
      next: () => {
        this.getPersonsAll();
      },
      error: (error) => {
        console.error('Error al eliminar la persona:', error);
      }
    });
  }
}
