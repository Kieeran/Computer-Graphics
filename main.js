import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const gui = new dat.GUI();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const leftLight = getSpotLight(0, 0, 0);

const sphere_1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 30),
    new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)',
    })
);

sphere_1.position.set(-5, 2, -4);
sphere_1.add(leftLight);
//scene.add(sphere_1);

const rightLight = getSpotLight(0, 0, 0);

const sphere_2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 30),
    new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)',
    })
);
sphere_2.position.set(5, 2, -4);
sphere_2.add(rightLight);
//scene.add(sphere_2);

const lightGroup = new THREE.Group();
lightGroup.add(sphere_1);
lightGroup.add(sphere_2);
scene.add(lightGroup);

//============================================================================

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 30),
    new THREE.MeshStandardMaterial({
        color: 'rgb(255, 255, 255)',
        shininess: 100
    })
);
sphere.position.y = sphere.geometry.parameters.radius;
sphere.castShadow = true;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15),
    new THREE.MeshStandardMaterial({
        color: 'rgb(255, 255, 255)',
        side: THREE.DoubleSide
    })
);
plane.rotateX(-Math.PI / 2);
plane.receiveShadow = true;
//plane.material.map = loadTexture();

const group1 = new THREE.Group();
group1.add(sphere);
group1.add(plane);

group1.position.x = 20

//============================================================================

const sphere_3 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 30),
    new THREE.MeshLambertMaterial({
        color: 'rgb(255, 255, 255)',
        shininess: 100
    })
);
sphere_3.position.y = sphere_3.geometry.parameters.radius;
sphere_3.castShadow = true;

const plane_1 = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15),
    new THREE.MeshLambertMaterial({
        color: 'rgb(255, 255, 255)',
        side: THREE.DoubleSide
    })
);
plane_1.rotateX(-Math.PI / 2);
plane_1.receiveShadow = true;

const group2 = new THREE.Group();
group2.add(sphere_3);
group2.add(plane_1);

group2.position.x = -20;

//============================================================================

const sphere_4 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 30),
    new THREE.MeshPhongMaterial({
        color: 'rgb(255, 255, 255)',
        shininess: 100
    })
);
sphere_4.position.y = sphere_4.geometry.parameters.radius;
sphere_4.castShadow = true;

const plane_2 = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 15),
    new THREE.MeshPhongMaterial({
        color: 'rgb(255, 255, 255)',
        side: THREE.DoubleSide
    })
);
plane_2.rotateX(-Math.PI / 2);
plane_2.receiveShadow = true;

const group3 = new THREE.Group();
group3.add(sphere_4);
group3.add(plane_2);

//============================================================================

const group = new THREE.Group();
group.add(group1);
group.add(group2);
group.add(group3);
scene.add(group);

const path = 'cubemap/';
const format = '.jpg';
const urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
];
const reflectionCube = new THREE.CubeTextureLoader().load(urls);
scene.background = reflectionCube;
reflectionCube.format = THREE.RGBAFormat;

var loader = new THREE.TextureLoader();
plane.material.map = loader.load('concrete.jpg');
plane.material.bumpMap = loader.load('concrete.jpg');
plane.material.roughnessMap = loader.load('concrete.jpg');
plane.material.bumpScale = 0.01;
plane.material.metalness = 0.01;
plane.material.roughness = 0.7;
plane.material.envMap = reflectionCube;
// sphere.material.roughnessMap = loader.load('fingerprint.jpg');
sphere.material.envMap = reflectionCube;

var maps = [plane.material.map, plane.material.bumpMap, plane.material.roughnessMap]
maps.forEach(function (map) {
    var texture = map;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.5);
});

camera.position.set(-0.7, 4, 4);
camera.lookAt(sphere.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// ===========================================DAT GUI===========================================
var folder1 = gui.addFolder("Light");

folder1.add(lightGroup.position, 'x', -10, 10);
folder1.add(lightGroup.position, 'y', -10, 10);
folder1.add(lightGroup.position, 'z', -10, 10);

var folder1_1 = folder1.addFolder("Left light");
var folder1_1_1 = folder1_1.addFolder("Position");
folder1_1_1.add(sphere_1.position, 'x', -10, 10);
folder1_1_1.add(sphere_1.position, 'y', -10, 10);
folder1_1_1.add(sphere_1.position, 'z', -10, 10);

var folder1_2 = folder1.addFolder("Right light");
var folder1_2_2 = folder1_2.addFolder("Position");
folder1_2_2.add(sphere_2.position, 'x', -10, 10);
folder1_2_2.add(sphere_2.position, 'y', -10, 10);
folder1_2_2.add(sphere_2.position, 'z', -10, 10);

var folder2 = gui.addFolder('Sphere');
folder2.add(sphere_4.material, 'shininess', 0, 1000).name('Sphere shininess');
folder2.add(sphere.material, 'roughness', 0, 1).name('Roughness');
folder2.add(sphere.material, 'metalness', 0, 1).name('Metalness');
folder2.open();

var folder3 = gui.addFolder("Plane");
folder3.add(plane_2.material, 'shininess', 0, 1000).name('Plane shininess');
folder3.add(plane.material, 'roughness', 0, 1).name('Roughness');
folder3.add(plane.material, 'metalness', 0, 1).name('Metalness');
folder3.open();

var folder4 = gui.addFolder("Material");

folder4.add(group.position, 'x', -20, 20);
folder4.open();

// var folder4_1 = folder4.addFolder("Mesh");
// folder4_1.add(group1.position, 'x', -20, 20);
// folder4_1.add(group1.position, 'z', -20, 20);

// var folder4_2 = folder4.addFolder("MeshLambertMaterial");
// folder4_2.add(group2.position, 'x', -20, 20);
// folder4_2.add(group2.position, 'z', -20, 20);
// ===========================================DAT GUI===========================================

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

function getSpotLight(x, y, z) {
    var light = new THREE.SpotLight("rgb(255, 220, 180)", 10);
    light.position.set(x, y, z);
    light.castShadow = true;
    light.penumbra = 0.5;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

animate();