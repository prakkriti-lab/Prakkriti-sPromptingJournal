export class TransformControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.enabled = true;
    this.object = null;
    this.mode = 'translate';
    this._listeners = new Map();
  }
  attach(object) { this.object = object; this._emit('change'); }
  detach() { this.object = null; this._emit('change'); }
  setMode(mode) { this.mode = mode; }
  addEventListener(type, cb) {
    const list = this._listeners.get(type) || [];
    list.push(cb); this._listeners.set(type, list);
  }
  _emit(type) { (this._listeners.get(type) || []).forEach((cb) => cb({ type, object: this.object })); }
}
