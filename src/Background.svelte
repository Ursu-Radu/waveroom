<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { MeshBasicMaterial, MeshStandardMaterial } from "three";
    import { mapRange, wrap } from "./utils/math";
    import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
    import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

    import { Howl, Howler } from "howler";

    let threeCanvas;

    const BLOCK_SIZE = 5;
    const BLOCK_SPACING = 7;

    let cameraX = 0;
    let hRot = [0, 0, 0];
    let vRot = [0, 0, 0];

    const RES = 64;
    const VISUALIZER_WIDTH = 60;
    const HUE_AREA = 180;
    const LIGHT_RARITY = 2;

    let hue = 0;

    let analyzer;
    let bufferLength;
    let dataArray;

    Howler.volume(0.2);

    var sound = new Howl({
        src: ["kero.mp3"],
        onplay: () => {
            analyzer = Howler.ctx.createAnalyser();
            Howler.masterGain.connect(analyzer);
            analyzer.connect(Howler.ctx.destination);
            analyzer.fftSize = 2048;
            bufferLength = analyzer.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        },
    });

    // setTimeout(() => {
    //     sound.play();
    // }, 3000);

    onMount(() => {
        const scene = new THREE.Scene();
        RectAreaLightUniformsLib.init();

        const renderer = new THREE.WebGLRenderer({
            canvas: threeCanvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(20, 20);
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);

        let blockGroup = new THREE.Group();
        let geometry = new THREE.BoxGeometry(
            BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );
        let material = new THREE.MeshStandardMaterial({
            color: 0x3c4066,
            roughness: 0.5,
        });

        for (let x = -20; x <= 20; x += 1) {
            for (let z = -1; z <= 1; z += 1) {
                let mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x * BLOCK_SPACING, 0, z * BLOCK_SPACING);
                blockGroup.add(mesh);
            }
        }

        scene.add(blockGroup);

        const ambient = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambient);

        let light = new THREE.PointLight(0xffffff, 0.25, 200);
        scene.add(light);

        let visualizer = new THREE.Group();

        for (let i = 0; i < RES; i++) {
            let width = VISUALIZER_WIDTH / RES;
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(width * 0.9, 1),
                new THREE.MeshBasicMaterial({ color: 0x000000 })
            );
            plane.position.set(width * i + width / 2, 0, 0);
            visualizer.add(plane);
            if (i % LIGHT_RARITY == 0) {
                let light = new THREE.PointLight(
                    0x00ff00,
                    0.1 * LIGHT_RARITY,
                    30
                );
                light.position.set(0, 0, 0.1);
                plane.add(light);
            }
        }

        scene.add(visualizer);

        const update = (delta: number) => {
            cameraX = wrap(cameraX + delta * 2.0, 0, BLOCK_SPACING);
            camera.position.set(cameraX, 8, 18);
            light.position.set(cameraX, 12, 12);
            visualizer.position.set(cameraX - VISUALIZER_WIDTH / 2, 6, -10);

            // rectLight.height = cameraX * 2;

            hRot[1] += (hRot[0] - hRot[1]) / 100;
            hRot[2] += (hRot[1] - hRot[2]) / 100;

            vRot[1] += (vRot[0] - vRot[1]) / 100;
            vRot[2] += (vRot[1] - vRot[2]) / 100;

            camera.rotation.x = vRot[2];
            camera.rotation.y = hRot[2];
            if (analyzer != null) analyzer.getByteFrequencyData(dataArray);

            hue = wrap(hue - delta * 20, 0, 360);
            if (dataArray != null) {
                console.log(dataArray);
            }
            const visualizerFunc = (x: number) =>
                (0.75 * x + 0.18) ** 5.0 + 0.005;

            visualizer.children.forEach((plane, i) => {
                let planeMesh = plane as THREE.Mesh;

                if (dataArray != null) {
                    let t = i / RES;
                    let t2 =
                        visualizerFunc(mapRange(t, 0, 1, 0.2, 1)) *
                        dataArray.length;
                    let height = mapRange(
                        t2,
                        Math.floor(t2),
                        Math.ceil(t2),
                        dataArray[Math.floor(t2)],
                        dataArray[Math.ceil(t2)]
                    );
                    planeMesh.scale.y = Math.max(
                        0.1,
                        (height / 256) ** 3.0 * 20
                    );
                    planeMesh.position.y = planeMesh.scale.y / 2;
                }

                let color = `hsl(${hue + HUE_AREA * (i / RES)}, 100%, 70%)`;
                (planeMesh.material as THREE.MeshBasicMaterial).color.set(
                    color
                );

                if (i % LIGHT_RARITY == 0) {
                    (plane.children[0] as THREE.PointLight).color.set(color);
                }
            });
        };

        let clock = new THREE.Clock();
        clock.start();

        const animate = () => {
            update(clock.getDelta());
            requestAnimationFrame(animate);
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        };
        animate();
    });
</script>

<svelte:window
    on:pointermove={e => {
        hRot[0] = mapRange(e.pageX, 0, window.innerWidth, 0.1, -0.1);
        vRot[0] = mapRange(e.pageY, 0, window.innerHeight, 0.1, -0.1);
    }}
/>

<canvas class="threeCanvas" bind:this={threeCanvas} />

<style>
    .threeCanvas {
        position: absolute;
        width: 100vw;
        height: 100vh;
    }
</style>
