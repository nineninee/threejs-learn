import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            
            // child.material.needsUpdate = true

            child.castShadow = true
            child.receiveShadow = true

        }
    })
}


/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/0/px.png',
    '/environmentMaps/0/nx.png',
    '/environmentMaps/0/py.png',
    '/environmentMaps/0/ny.png',
    '/environmentMaps/0/pz.png',
    '/environmentMaps/0/nz.png',
])
environmentMap.outputColorSpace = THREE.SRGBColorSpace
scene.background = environmentMap

// scene.environment = environmentMap

debugObject.envMapIntensity = 1
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

// Global intensity
// global.envMapIntensity = 1
// gui
//     .add(global, 'envMapIntensity')
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
// rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
// {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

//     scene.background = environmentMap
//     scene.environment = environmentMap
// })

/**
 * Models
 */
// Helmet
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(0, -4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
    
        updateAllMaterials()
    }
)

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// renderer.physicallyCorrectLight = true ↓
renderer.useLegacyLights = true
// renderer.outputEncoding = THREE.sRGBEncoding ↓
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3

gui.
    add(
        renderer,
        'toneMapping',
        {
            No: THREE.NoToneMapping,
            Linear: THREE.LinearToneMapping,
            Reinhard: THREE.ReinhardToneMapping,
            Cineon: THREE.CineonToneMapping,
            ACESFilmic: THREE.ACESFilmicToneMapping
        }
    )
    .onFinishChange(() => {
        updateAllMaterials()
    })
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()