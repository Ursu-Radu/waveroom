<script lang="ts">
    import p5 from "p5";
    import { clamp, mapRange, wrap } from "../utils/math";
    import { onMount } from "svelte";

    const BAR_WIDTH = 40;
    const BAR_SPACING = 20;
    const BAR_MAX_HEIGHT = 300;

    let p5div: HTMLDivElement;
    let time = 0;

    let barOffset = 0;
    let barWiggle = [0, 0, 0];

    const sketch = (p: p5) => {
        p.setup = () => {
            p.createCanvas(20, 20);
            p.ellipseMode(p.RADIUS);
            p.colorMode(p.HSB, 360);
            // p.frameRate(20);
        };
        p.draw = () => {
            if (p.frameRate() != 0) {
                let delta = 1.0 / p.frameRate();

                time += delta;
                barOffset += delta * 20;
                barWiggle[1] += (barWiggle[0] - barWiggle[1]) / 50;
                barWiggle[2] += (barWiggle[1] - barWiggle[2]) / 50;
            }
            if (p5div != null)
                p.resizeCanvas(p5div.offsetWidth, p5div.offsetHeight);

            p.background("#0F1019");
            p.translate(p.width / 2, p.height / 2);

            const barHeight = (x: number) =>
                BAR_MAX_HEIGHT * Math.sin(x / 150 - time);
            const barHue = (x: number) =>
                wrap(10000 + x / 5 - time * 100, 0, 360);

            p.rotate(-0.1);
            p.noStroke();

            for (
                let i =
                    -p.width * 1.5 + (barOffset % (BAR_WIDTH + BAR_SPACING));
                i <= p.width * 1.5;
                i += BAR_WIDTH + BAR_SPACING
            ) {
                p.fill(barHue(i), 180, 360);

                const SWITCH_FRAC = 0.05;

                let height = barHeight(i);
                let visibleHeight = Math.max(
                    Math.abs(height),
                    BAR_MAX_HEIGHT * SWITCH_FRAC
                );
                let yPos =
                    clamp(
                        mapRange(
                            height,
                            BAR_MAX_HEIGHT * SWITCH_FRAC,
                            -BAR_MAX_HEIGHT * SWITCH_FRAC,
                            0,
                            -1
                        ),
                        -1,
                        0
                    ) * visibleHeight;

                let scale = mapRange(Math.cos(time / 2.0), -1, 1, 0.5, 1);
                p.fill("#fff2");
                p.rect(
                    i + 8.0 + barWiggle[2],
                    yPos * scale + 8.0,
                    BAR_WIDTH,
                    visibleHeight * scale,
                    10
                );

                p.fill(barHue(i), 180, 360);

                p.rect(
                    i + barWiggle[2],
                    yPos * scale,
                    BAR_WIDTH,
                    visibleHeight * scale,
                    10
                );
            }
        };
    };

    onMount(() => {
        new p5(sketch, p5div);
    });
</script>

<svelte:window
    on:pointermove={e => {
        barWiggle[0] = clamp(
            mapRange(e.pageX, 0, window.innerWidth, -200, 200),
            -200,
            200
        );
    }}
/>

<div class="p5div" bind:this={p5div} />

<style>
    .p5div {
        position: absolute;
        width: 100vw;
        height: 100vh;
    }
    :global(.p5div > *) {
        display: inline-block;
    }
</style>
