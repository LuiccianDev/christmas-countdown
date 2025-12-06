import * as THREE from 'three';

export class SnowSystem {
  private snowflakes: THREE.Sprite[] = [];
  private textures: THREE.Texture[] = [];
  private scene: THREE.Scene;
  
  constructor(scene: THREE.Scene, snowCount: number = 100) {
    this.scene = scene;
    this.createTextures();
    this.createSnowflakes(snowCount);
  }
  
  private createTextures(): void {
    const symbols = ["❄", "❅", "❆"];
    
    symbols.forEach(symbol => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 32, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      this.textures.push(texture);
    });
  }
  
  private createSnowflakes(count: number): void {
    for (let i = 0; i < count; i++) {
      const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
      const snowMat = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true, 
        opacity: 0.8 
      });
      const snow = new THREE.Sprite(snowMat);
      const scale = 0.3 + Math.random() * 0.4;
      snow.scale.set(scale, scale, 1);
      snow.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 25,
        (Math.random() - 0.5) * 40
      );
      this.scene.add(snow);
      this.snowflakes.push(snow);
    }
  }
  
  public update(): void {
    const time = Date.now() * 0.001;
    
    this.snowflakes.forEach(snow => {
      snow.position.y -= 0.02 + Math.random() * 0.01;
      snow.position.x += Math.sin(time + snow.position.z) * 0.01;
      
      if (snow.position.y < -2) {
        snow.position.y = 25;
        snow.position.x = (Math.random() - 0.5) * 40;
        snow.position.z = (Math.random() - 0.5) * 40;
      }
    });
  }
  
  public dispose(): void {
    this.snowflakes.forEach(snow => {
      this.scene.remove(snow);
      snow.material.dispose();
    });
    this.textures.forEach(texture => texture.dispose());
    this.snowflakes = [];
    this.textures = [];
  }
}
