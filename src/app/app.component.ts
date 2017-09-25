import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

// Se importa el servicio creado
import { UsersService } from './users.service';

// Librerias para utilizar el modal
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  data: object = {};  // Variable a la cual se le asignan los datos de la api
  page = 1;  // Valor inicial para obtener los datos iniciales
  showPrev = false;   // Variable que permite mostrar el boton de la pagina anterior
  showNext = true;  //  Variable que permite mostrar el boton siguiente
  logo =  '../assets/images/beetrack.png';
  user = {       // Objeto que es utilizado apra crear un nuevo usuario
    photo: '',
    name: '',
    description: ''
  };
  closeResult: string;
  modalRef: any;   // Referencia para el servicio del modal para manejar de mejor forma este.
  constructor( private usersService: UsersService, private modalService: NgbModal) {
    this.getUsers();  // Se traen los datos de la api
  }
  getUsers() {    // Metodo que llama al servicio de usuario para traer los usuarios por pagina
    console.log('Pagina ' + this.page);
    this.usersService.getUsers(this.page)
      .subscribe( res => {
        this.data = res;
        this.data = Array.of(this.data);
        console.log('Usuarios en esta pagina ' + this.data[0].length );
        if (this.data[0].length < 10) { this.showNext = false; }else { this.showNext = true; }
      });
  }
  getFirstUsers() {    // Metodo apra traer los usuarios de la primera pagina o cuando debe recargarse la pagina
    this.page = 1;
    this.getUsers();
  }
  postUser(user) {    // Metodo para crear un nuevo usuario
    this.usersService.createUser(user).subscribe( res => {
      console.log(res);
      this.modalRef.close();
      this.user.name = '';
      this.user.description = '';
      this.user.photo = '';
      this.getFirstUsers();
      }
    );
  }
  searchUser(text: string) {    // Metodo para buscar un usuario
    console.log('Buscando usuario ' + text);
    if (text.length === 0) { this.getFirstUsers(); }    // Verifica que si no hay nada escrito muestre los datos iniciales
    this.usersService.getUsersbyName(text)
      .subscribe( res => {
        this.data = res;
        this.data = Array.of(this.data);
      });
  }
  deleteUser(id: number) {    // Metodo para eliminar un usuario
    this.usersService.deleteUser(id)
      .subscribe( res => {
        this.getFirstUsers();
        });
  }
  nextPage() {    // Pasa a la siguiente pagina
    this.page = this.page + 1;
    this.getUsers();
    this.showPrev = true;
  }
  previousPage() {    // Pasa a la pagina anterior
    this.page = this.page - 1;
    this.getUsers();
    // Condicion para verificar si se muestran los botones de las paginas anteriores o siguientes
    if (this.page === 1) { this.showPrev = false; }else { this.showPrev = true; }
  }
  open(content) { // Metodo para abrir modal y cerrarlo, configuracion por defecto.
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string { // Retorna razon de cierre de modal, no se utiliza.
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
