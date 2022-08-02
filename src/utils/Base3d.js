import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "three-tween";
// import gsap from 'gsap'

class Base3d {
    constructor(dom) {
        this.container = dom;
        this.scene;
        this.camera;
        this.renderer;
        this.controls;
        this.axes;
        this.number = 26016;
        this.modelNumber = 3;
        this.current = 0;
        this.bufArrays = [];
        this.vertices = [];
        this.bufferGeometry;
        this.points;
        this.init();
        this.aniRender();
    }
    init() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.addAxes();
        this.initControls();
        // this.addBox();
        this.initGltf();
        this.initPoint();
        window.addEventListener("resize", this.windowResize.bind(this));
    }
    initScene() {
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0x000000);
        this.scene.background = this.backgroundTexture();
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 6);
    }
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
    }
    addBox() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
        });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
    }
    addAxes() {
        this.axes = new THREE.AxesHelper(50);
        this.scene.add(this.axes);
    }
    initControls() {
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
    }
    aniRender() {

        this.points.rotation.x += 0.0003;
        this.points.rotation.y += 0.001;
        this.points.rotation.z += 0.002;

        TWEEN.update();

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.aniRender.bind(this));
    }

    windowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    }

    backgroundTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0);
        gradient.addColorStop(0, "#4e22b7");
        gradient.addColorStop(1, "#3292ff");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        return new THREE.CanvasTexture(canvas);
    }

    initGltf() {
        const manager = new THREE.LoadingManager();
        const gltfLoader = new GLTFLoader(manager);
        gltfLoader.load("model/box.glb", (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.scale(0.5, 0.5, 0.5);
                    const {
                        array
                    } = child.geometry.attributes.position;
                    this.bufArrays.push(array);
                }
            });
        });
        gltfLoader.load("model/spher.glb", (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.scale(0.5, 0.5, 0.5);
                    const {
                        array
                    } = child.geometry.attributes.position;
                    this.bufArrays.push(array);
                }
            });
        });
        gltfLoader.load("model/cir.glb", (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.scale(0.5, 0.5, 0.5);
                    const {
                        array
                    } = child.geometry.attributes.position;
                    this.bufArrays.push(array);
                }
            });
        });

        manager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log("start");
        };
        manager.onLoad = () => {
            // console.log('load', this.bufArrays);
            this.transitionPoint();
        };
        manager.onError = (url) => {
            console.wran(url);
        };
    }

    initPoint() {
        this.bufferGeometry = new THREE.BufferGeometry();
        this.bufferGeometry.tween = [];
        // console.log(bufferGeometry);
        for (let i = 0; i < this.number; i++) {
            const position = THREE.MathUtils.randFloat(-4, 4)
            this.bufferGeometry.tween.push(
                new TWEEN.Tween({
                    position
                }).easing(TWEEN.Easing.Exponential.In)
            );
            this.vertices.push(position)
        }

        this.bufferGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(this.vertices), 3)
        );

        this.points = new THREE.Points(
            this.bufferGeometry,
            new THREE.PointsMaterial({
                map: new THREE.TextureLoader().load("img/white-dot.png"),
                size: 0.032,
                alphaTest: 0.1,
                opacity: 0.8,
                transparent: true,
                depthTest: true,
            })
        );

        this.scene.add(this.points)
    }

    transitionPoint() {
        for (let i = 0, j = 0; i < this.number; i++, j++) {
            const item = this.bufferGeometry.tween[i];

            if (j >= this.bufArrays[this.current].length) {
                j = 0;
            }

            const _position = this.bufArrays[this.current][j]

            const self = this
            item.to({
                    position: _position
                },
                THREE.MathUtils.randFloat(1000, 4000)
            ).onUpdate(
                function () {
                    self.bufferGeometry.attributes.position.array[i] = this.position;
                    self.bufferGeometry.attributes.position.needsUpdate = true;
                }

            ).start()
        }

        setTimeout(() => {
            this.transitionPoint()
        }, 6000);

        this.current = (this.current + 1) % this.modelNumber;

    }
}

export default Base3d;