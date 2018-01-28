
import {MapObject} from "../models/MapObject.model";
import {MapObjectType} from "../enums/MapObjectType.enum";

/*
 * What: This class has the responsibility of handing out available colors for map objects.
 * Also, it creates map objects (markers/orgUnit markers)
 * Why: To make to code more reuseable.
 */
export class MapObjectFactory {
  static readonly trendLineColors:string[] = ["darkred", "cornflowerblue", "gold", "peru", "violet", "darkolivegreen "];
  static readonly colors:string[] = ["red", "blue", "yellow", "brown", "purple", "green"];
  private static takenColors:Set<string> = new Set<string>();

  public static getNewColor():string {
    if(MapObjectFactory.takenColors.size >= MapObjectFactory.colors.length)
      return null;

    for(let i = 0; i < MapObjectFactory.colors.length; i++){
      let color = MapObjectFactory.colors[i].toLowerCase();
      if(!MapObjectFactory.takenColors.has(color)) {
          MapObjectFactory.takenColors.add(color);
          return color;
      }
    }
  }
  public static getMapObject(type:MapObjectType, color:string, L:any):MapObject {

    let mapObject:MapObject = new MapObject(L.Icon.extend({
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22,94],  // point of the icon which will correspond to marker's location 22,94
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    }));

    switch(type) {
      case MapObjectType.ENTITY :
        mapObject.setIconShadowUrl('assets/images/marker-shadow.png');
        mapObject.setIconAttributes({iconSize: [25, 41], iconAnchor: [12,40], iconUrl: 'assets/images/marker-icon-' + color + '.png'});
          break;
      case MapObjectType.FACILITY :
        mapObject.setIconShadowUrl('assets/images/facility-shadow.png');
        mapObject.setIconAttributes({iconAnchor: [15, 15] ,iconUrl: 'assets/images/facility.png'});
        break;
      default :
        break;
    }
    return mapObject;
  }

  public static reset():void{
    this.takenColors.clear();
  }
  public static releaseColor(color:string):void {
      MapObjectFactory.takenColors.delete(color);
  }
}


