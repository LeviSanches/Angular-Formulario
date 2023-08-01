import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit{

  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient) {}

  ngOnInit(): void {  

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, Validators.minLength(8)]],
        numero: [null],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],   
      })
    })

  } 

  popularDadosForm(dados: any) {

    this.formulario.patchValue({
      endereco: { 
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
  }

  consultaCep() {

    let cep = this.formulario.get('endereco.cep')?.value;
    console.log(cep)
    let formataCep = cep.replace(/\D/g, '');
    console.log(formataCep)

    if (cep != '') {
      let validaCep = /^[0-9]{8}$/;
      if (validaCep.test(cep)) {
        this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
          (dados) => {
            this.popularDadosForm(dados);
          },
          (error) => {            
            console.error('Erro na requisição:', error);
          }
        );
      }
    }
  }



  onSubmit() {
    
    if (this.formulario.valid) {
      this.http.post(
        'https://jsonplaceholder.typicode.com/posts', 
        JSON.stringify(this.formulario.value)).subscribe(
          (response) => {
          console.log('Resposta do servidor:', response);
          this.formulario.reset();      
          },
          (error) => {
            console.error('Erro na requisição:', error);          
          }
        )     
    } else {
      console.log(this.formulario.controls)
      Object.keys(this.formulario.controls).forEach(campo => {
        console.log(campo)
        const controle = this.formulario.get(campo);
        controle?.markAsDirty
      })
    }

    
  }

  debug() {
    console.log(this.formulario.get('email')?.value)
  }

}
