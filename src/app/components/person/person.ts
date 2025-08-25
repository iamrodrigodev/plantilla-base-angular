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
    this.editarForm.setValue({
      nombre: persona.nombre,
      apellido: persona.apellido,
      edad: persona.edad
    });
    const modal = document.getElementById('editarPersonaModal');
    if (modal) {
      (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.show();
    }
  }

  abrirEliminar(persona: Persona): void {
    this.personaSeleccionada = { ...persona };
    const modal = document.getElementById('eliminarPersonaModal');
    if (modal) {
      (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.show();
    }
  }

  ngOnInit(): void {
  this.getPersonsAll();
  }

  getPersonsAll(): void {
    this.personService.getAllPersons().subscribe({
    next: (resp: any) => {
          if (Array.isArray(resp)) {
            this.persons = resp;
          } else if (resp && Array.isArray(resp.dato)) {
            this.persons = resp.dato;
          } else {
            this.persons = [];
          }
        },
        error: (error) => {
          this.persons = [];
          console.error('Error al obtener todas las personas:', error);
        }
      });
  }

  createPerson(): void {
  const body = this.crearForm.value;
  this.personService.createPerson(body).subscribe({
    next: () => {
      const modal = document.getElementById('crearPersonaModal');
          if (modal) {
            (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.hide();
          }
      this.getPersonsAll();
      this.crearForm.reset();
    },
    error: (error) => {
      console.error('Error al crear una persona:', error);
    }
  });
}

  updatePerson(): void {
  const body = this.editarForm.value;
  this.personService.updatePerson(this.personaSeleccionada!.id, body).subscribe({
        next: () => {
          this.getPersonsAll();
          const modal = document.getElementById('editarPersonaModal');
          if (modal) {
            (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.hide();
          }
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
        const modal = document.getElementById('eliminarPersonaModal');
        if (modal) {
          (window as any).bootstrap?.Modal.getOrCreateInstance(modal)?.hide();
        }
        this.getPersonsAll();
      },
      error: (error) => {
        console.error('Error al eliminar la persona:', error);
      }
    });
  }
}
