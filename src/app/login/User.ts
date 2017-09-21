
export class User {


  constructor(
  private username:string,
  private password:string,
  private connectionLink:string,
  ){
    this.username = username;
    this.password = password;
    this.connectionLink = connectionLink;
  }

  getUsername(): string {
    return this.username;
  }
  getPassword():string {
    return this.password;
  }
  getConnectionLink():string {
    return this.connectionLink;
  }
  setConnectionLink(connectionLink:string){
    this.connectionLink = connectionLink;
  }
}
