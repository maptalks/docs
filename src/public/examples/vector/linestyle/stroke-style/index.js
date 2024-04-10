const map = new maptalks.Map("map", {
  center: [-73.99727760921917, 40.75410734656785],
  zoom: 14,
  zoomControl: true,
  bearing: 29.6,
  pitch: 7.6,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png"
        },
        prefilterCubeSize: 32
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});

/**start**/
const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt"
});

const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "provincial-highway"], ["==", "$type", "LineString"]],
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: [0.73, 0.73, 0.73, 1],
        lineJoin: "round",
        lineStrokeWidth: {
          type: "exponential",
          default: 0,
          stops: [[14.1, 2]]
        },
        lineStrokeColor: [0.1882352, 0.1882352, 0.1882352, 1],
        lineWidth: {
          type: "exponential",
          default: 2,
          stops: [
            [13, 2],
            [14, 10],
            [16, 30],
            [17, 80]
          ]
        }
      }
    }
  ]
};
vt.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill"
      },
      symbol: {
        polygonFill: [0.3215686, 0.3215686, 0.3215686, 1]
      }
    }
  }
});
groupLayer.addTo(map);