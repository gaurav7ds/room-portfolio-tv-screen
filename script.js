import * as THREE from 'three'
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const textureLoader = new THREE.TextureLoader()
const imageTexture = textureLoader.load('/me.jpg')

const vertexShader = `
    uniform float time;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec3 pos = position;
        pos.z = sin(pos.y * 3.0 + time * 1.0) * 0.1 + sin(pos.x * 4.0 + time * 1.0) * 0.1;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D imgTexture;
    void main() {
        vec4 imageColor = texture2D(imgTexture, vUv);
        gl_FragColor = imageColor;
    }
`;

const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0.0 },
        imgTexture: { value: imageTexture }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
})

const planeGeometry = new THREE.PlaneGeometry(3.2, 2.2, 128, 128)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, .4, 0)

const scene = new THREE.Scene()

scene.add(plane)

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
camera.position.z = 2.3
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

    // Update materials
    material.uniforms.time.value = elapsedTime

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

const btn = document.querySelector('.cta')
let onAbout = false;
btn.addEventListener('click', (e) => {
    onAbout = !onAbout
    if(onAbout){
        btn.innerText = 'Back Up'
        btn.attributes.href.value = '#about'
    }else{
        btn.innerText = 'Know More'
        btn.attributes.href.value = '#home'
    }
})
