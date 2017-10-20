
export class ColorHandlerUtil {
  private static readonly colors:string[] = ["RED", "BLUE", "YELLOW", "BROWN", "PURPLE", "GREEN"];
  private static pointer:number = 0;

  public static getNextAvailableColor():string{
    return this.colors[this.pointer++].toLowerCase();
  }
  public static getMarker(color:string, L:any):any{
    var LeafIcon = L.Icon.extend({
      shadowUrl: '../../assets/img/marker-shadow.png',
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22,94],  // point of the icon which will correspond to marker's location 22,94
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    return new LeafIcon({iconSize: [25, 41], iconAnchor: [15,40], iconUrl: '../../assets/img/marker-icon-' + color + '.png'});
  }

  public static reset(){
    this.pointer = 0;
  }
}
