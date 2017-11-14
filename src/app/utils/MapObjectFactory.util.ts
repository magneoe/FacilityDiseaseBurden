
import {MapObject} from "../models/MapObject.model";
import {MapObjectType} from "../enums/MapObjectType.enum";

/*
 * What: This class has the responsibility of handing out available colors for map objects.
 * Also, it creates map objects (markers/orgUnit markers)
 * Why: To make to code more reuseable.
 */
export class MapObjectFactory {
  private static readonly colors:string[] = ["RED", "BLUE", "YELLOW", "BROWN", "PURPLE", "GREEN"];
  private static pointer:number = 0;
  private static programColorMap:Map<string, number> = new Map<string, number>();

  public static getNextAvailableColor(progId:string):string {
    if(MapObjectFactory.programColorMap.has(progId))
      return this.colors[MapObjectFactory.programColorMap.get(progId)].toLowerCase();
    else
      MapObjectFactory.programColorMap.set(progId, this.pointer);
    return this.colors[this.pointer++].toLowerCase();
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
        mapObject.setIconShadowUrl('../../assets/img/marker-shadow.png');
        mapObject.setIconAttributes({iconSize: [25, 41], iconAnchor: [12,40], iconUrl: '../../assets/img/marker-icon-' + color + '.png'});
          break;
      case MapObjectType.FACILITY :
        mapObject.setIconShadowUrl('../../assets/img/facility-shadow.png');
        mapObject.setIconAttributes({iconAnchor: [15, 15] ,iconUrl: '../../assets/img/facility.png'});
        break;
      default :
        break;
    }
    return mapObject;
  }

  public static reset(){
    this.pointer = 0;
    this.programColorMap.clear();
  }
}


