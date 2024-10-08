const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const options = {
  // 默认颜色
  color: "Red",
  // 默认字体
  font: "30px san-serif",
};

class HelloLayer extends maptalks.Layer {
  // 构造函数
  constructor(id, data, options) {
    super(id, options);
    this.data = data;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  getData() {
    return this.data;
  }
}

// 定义默认的图层配置属性
HelloLayer.mergeOptions(options);

class HelloLayerRenderer extends maptalks.renderer.CanvasRenderer {
  checkResources() {
    // HelloLayer只是绘制文字, 没有外部图片, 所以返回空数组
    return [];
  }

  draw() {
    const drawn = this._drawData(
      this.layer.getData(),
      this.layer.options.color
    );
    // 记录下绘制过的数据
    this._drawnData = drawn;
    // 结束绘制:
    // 1. 触发必要的事件
    // 2. 将渲染器的canvas设为更新状态, map会加载canvas并呈现在地图上
    this.completeRender();
  }

  /**
   * 绘制数据
   */
  _drawData(data, color) {
    if (!Array.isArray(data)) {
      return;
    }
    const map = this.getMap();
    // prepareCanvas是父类CanvasRenderer中的方法
    // 用于准备canvas画布
    // 如果canvas不存在时, 则创建它
    // 如果canvas已存在, 则清空画布
    this.prepareCanvas();
    // this.context是渲染器canvas的CanvasRenderingContext2D
    const ctx = this.context;
    // 设置样式
    ctx.fillStyle = color;
    ctx.font = this.layer.options["font"];

    const containerExtent = map.getContainerExtent();
    const drawn = [];
    data.forEach((d) => {
      // 将中心点经纬度坐标转化为containerPoint
      // containerPoint是指相对地图容器左上角的像素坐标.
      const point = map.coordinateToContainerPoint(
        new maptalks.Coordinate(d.coord)
      );
      // 如果绘制的点不在屏幕范围内, 则不做绘制以提高性能
      if (!containerExtent.contains(point)) {
        return;
      }
      const text = d.text;
      const len = ctx.measureText(text);
      ctx.fillText(text, point.x - len.width / 2, point.y);
      drawn.push(d);
    });

    return drawn;
  }
}

HelloLayer.registerRenderer("canvas", HelloLayerRenderer);

const layer = new HelloLayer("hello");
layer.setData([
  {
    coord: map.getCenter().toArray(),
    text: "Hello World",
  },
  {
    coord: map.getCenter().add(0.01, 0.01).toArray(),
    text: "Hello World 2",
  },
]);
layer.addTo(map);
