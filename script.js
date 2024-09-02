import * as THREE from 'three'
import gsap from 'gsap'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const textureLoader = new THREE.TextureLoader()
const imageTexture = textureLoader.load('/Frame1.png')
imageTexture.flipY = false

imageTexture.colorSpace = THREE.SRGBColorSpace

const loader = new GLTFLoader()
const material = new THREE.MeshBasicMaterial({
    map: imageTexture,
    transparent: true
})

const scene = new THREE.Scene()
let model;

loader.load('/model.glb', (gltf) => {
    model = gltf.scene
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = material
            child.material.side = THREE.DoubleSide;
        }
    })
    model.position.set(.7, .1, 0)
    model.scale.set(1,1,1)
    model.rotation.x = .1
    model.rotation.z = .1

    scene.add(model)
})

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(5, 5, 5)
scene.add(light)
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Render
    if(model){
        model.rotation.y = -elapsedTime*.5
    }
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


const btn = document.querySelector('.cta')
let onAbout = false;
btn.addEventListener('click', (e) => {
    onAbout = !onAbout
    if(onAbout){
        btn.innerText = 'Back Up'
        gsap.to(model.position, {
            y:3,
            duration: .8
        })
        btn.attributes.href.value = '#about'
    }else{
        gsap.to(model.position, {
            y:.1,
            duration: 1
        })
        btn.innerText = 'Know More'
        btn.attributes.href.value = '#home'
    }
})
