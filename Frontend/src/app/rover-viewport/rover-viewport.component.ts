import { Component, ElementRef, OnInit } from '@angular/core';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import { RoverDataService } from '../rover-data.service';

@Component({
  selector: 'app-rover-viewport',
  templateUrl: './rover-viewport.component.html',
  styleUrls: ['./rover-viewport.component.scss']
})
export class RoverViewportComponent implements OnInit {

  constructor(private domElement: ElementRef,private roverData:RoverDataService) {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.keyLight = new Three.DirectionalLight(new Three.Color('hsl(30, 100%, 75%)'), 1.0);
    this.fillLight = new Three.DirectionalLight(new Three.Color('hsl(240, 100%, 75%)'), 0.75);
    this.backLight = new Three.DirectionalLight(0xffffff, 1.0);
  }

  viewportSize = {x:500,y:500}
  fixedCameraDistance = 280; // Set the desired fixed distance
  renderer = new Three.WebGLRenderer({alpha:true});
  scene = new Three.Scene();
  camera = new Three.PerspectiveCamera(75, this.viewportSize.x / this.viewportSize.y, 0.1, 1000);
  controls: OrbitControls;
  keyLight: Three.DirectionalLight;
  fillLight: Three.DirectionalLight;
  backLight: Three.DirectionalLight;
  rover: Three.Group | null  = null;



  ngOnInit(): void {
    this.roverData.telemetryUpdate.subscribe(() => this.changeRoverOrientation())
    this.renderer.setSize(this.viewportSize.x, this.viewportSize.y);
    this.domElement.nativeElement.querySelector('div.viewport').appendChild(this.renderer.domElement);
    this.initialize();
    this.animate();
  }

  // Create all the objects and load the materials
  initialize() {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = false; // Disable the zoom function
    this.controls.enablePan = false; // Disable panning
    this.keyLight.position.set(-100, 0, 100);
    this.fillLight.position.set(100, 0, 100);
    this.backLight.position.set(100, 0, -100).normalize();
    this.scene.add(this.keyLight);
    this.scene.add(this.fillLight);
    this.scene.add(this.backLight);
    //this.mtlLoader.setTexturePath('assets/');
    let mtlLoader = new MTLLoader();
    mtlLoader.setPath('assets/');
    mtlLoader.load('r2-d2.mtl', (materials) => {
      materials.preload();
      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('assets/');
      objLoader.load('verticalrover.obj', (object) => {
        this.rover = object;
        this.scene.add(object);
        object.position.y -= 60;

        // Calculate the bounding box of the loaded object
        var box = new Three.Box3().setFromObject(object);
        var center = box.getCenter(new Three.Vector3());

        // Set the camera position to maintain fixed distance
        var cameraOffset = new Three.Vector3(0, 0, this.fixedCameraDistance);
        var cameraPosition = center.clone().add(cameraOffset);
        this.camera.position.copy(cameraPosition);
        this.camera.lookAt(center);

        // Update the controls target to the center of the object
        this.controls.target.copy(center);
      });
    });
  }

  changeRoverOrientation(){
    let t = this.roverData.getTelemetry()
    this.rover?.rotation.set(t.gyroscope.y,t.accelerometer.z,t.accelerometer.x);

  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

}
