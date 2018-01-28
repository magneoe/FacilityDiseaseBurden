export class MapObject {
  private icon:any;

  constructor(icon:any){
    this.setIcon(icon);
  }
  public getIcon():any {
    return this.icon;
  }
  public setIcon(icon:any):void {
    this.icon = icon;
  }
  public setIconShadowUrl(shadowUrl:any){
    this.icon.shadowUrl = shadowUrl;
  }
  public setIconAttributes(attributes:any){
      this.icon = new this.icon(attributes);
  }
}
