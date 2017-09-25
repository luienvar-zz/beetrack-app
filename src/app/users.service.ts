import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


/* Servicio de usuario para manejo de Api */
@Injectable()
export class UsersService {

  url = 'http://localhost:3000/api/users';

  constructor(private http: Http) { }

  private handleError (error: Response | any) {
    console.error('UsersService::handleError', error);
    return Observable.throw(error);
  }
  /* Metodos para acceder a la api acorde a lo necesitado */
  // Retorna los usuarios separandolos por paginas
  getUsers(page: number) {
    return this.http.get(this.url + '/?_page=' + page + '&_limit=10')
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }
  // Retorna un usuario buscado por su identificador
  getUserbyId(id: number) {
    return this.http.get(this.url + '/' + id)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }
  // Crea un nuevo usuario con el header pedido el cuales el por defecto en Angular
  createUser(user: Object) {
    return this.http.post(this.url, user)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }
  // Elimina un usuario
  deleteUser(id: number) {
    console.log(this.url + '/' + id);
    return this.http.delete(this.url + '/' + id)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }
  // Busca un(os) usuario(s)
  getUsersbyName(name: string) {
    return this.http.get(this.url + '?q=' + name)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }
}
