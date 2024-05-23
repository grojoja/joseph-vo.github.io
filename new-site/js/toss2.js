let scene, camera, renderer, dice, raycaster;
let isTossing = false;
let animationEnd = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff); // Set background color to white
    document.body.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = [];
    const loader = new THREE.TextureLoader();
    for (let i = 1; i <= 6; i++) {
        material.push(new THREE.MeshBasicMaterial({ map: loader.load(`face${i}.png`) }));
    }
    dice = new THREE.Mesh(geometry, material);
    scene.add(dice);

    raycaster = new THREE.Raycaster();

    document.addEventListener('mousedown', tossDice, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (isTossing) {
        let currentDate = new Date();
        dice.rotation.x += 0.1;
        dice.rotation.y += 0.1;
        dice.rotation.z += 0.1;

        if (currentDate.getTime() > animationEnd) {
            finalizeToss();
        }
    }

    renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function tossDice() {
    isTossing = true;
    let duration = 2000; // 2 seconds of animation
    let currentDate = new Date();
    animationEnd = currentDate.getTime() + duration;
}

function finalizeToss() {
    isTossing = false;
    // Set to a random rotation ending
    dice.rotation.x = Math.random() * 2 * Math.PI;
    dice.rotation.y = Math.random() * 2 * Math.PI;
    dice.rotation.z = Math.random() * 2 * Math.PI;
}
init();
