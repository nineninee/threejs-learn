import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// import { directionalLight } from 'three/addons/helpers/directionalLightHelper.js';
// import { hemisphereLight } from 'three/addons/helpers/hemisphereLightHelper.js';
// import { pointLight } from 'three/addons/helpers/pointLightHelper.js';

import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
// import { spotLight } from 'three/addons/helpers/spotLightHelper.js';

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axes
 */
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// ambientLight.color = new THREE.Color(0xffffff)
// ambientLight.intensity = 0.7
scene.add(ambientLight)

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)

// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)
// gui.add(pointLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(pointLight.position, 'x').min(0).max(1).step(0.001)

const directionalLight = new THREE.DirectionalLight(0x0000cc, 0.5)
scene.add(directionalLight)
directionalLight.position.x = 2

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10,4)
scene.add(pointLight)
pointLight.position.set(1, -0.5, 1)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)


const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.25, 1)
scene.add(spotLight)
spotLight.position.set(0, 2, 3)

spotLight.target.position.x = -0.75
scene.add(spotLight.target)

const directionalLighthELPER = new THREE.DirectionalLightHelper( directionalLight, 0.2 );
rectAreaLight.add(directionalLighthELPER);

const hemisphereLightHelper = new THREE.HemisphereLightHelper( hemisphereLight, 0.2  );
rectAreaLight.add(hemisphereLightHelper);

const pointLightHelper = new THREE.PointLightHelper( pointLight, 0.2  );
rectAreaLight.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper( spotLight);
rectAreaLight.add(spotLightHelper);

window.requestAnimationFrame(() => {
    spotLightHelper.update()
})

const rectAreaLightHelper = new RectAreaLightHelper( rectAreaLight, 0.5  );
rectAreaLight.add(rectAreaLightHelper);

window.requestAnimationFrame(() => {
    rectAreaLightHelper.position.copy(rectAreaLight.position)
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
    // rectAreaLightHelper.position.x = rectAreaLight.position.x
    // rectAreaLightHelper.position.y = rectAreaLight.position.y
    // rectAreaLightHelper.position.z = rectAreaLight.position.z
})

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()