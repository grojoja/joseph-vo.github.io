let scene, camera, renderer, dice, raycaster, mouse = new THREE.Vector2(), INTERSECTED;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff); // Set background color to white
    document.body.appendChild(renderer.domElement);

    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000, userData: { URL: "landingpage.html" }}),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, userData: { URL: "otherexperience.html" }}),
        new THREE.MeshBasicMaterial({ color: 0x0000ff, userData: { URL: "nextpage.html" }}),
        new THREE.MeshBasicMaterial({ color: 0xffff00, userData: { URL: "courses.html" }}),
        new THREE.MeshBasicMaterial({ color: 0x00ffff, userData: { URL: "toss2.html" }}),
        new THREE.MeshBasicMaterial({ color: 0xff00ff, userData: { URL: "R.png" }})
    ];

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    dice = new THREE.Mesh(geometry, materials);
    scene.add(dice);

    raycaster = new THREE.Raycaster();

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    dice.rotation.x += 0.01;
    dice.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(dice);

    if (intersects.length > 0) {
        const faceIndex = intersects[0].face.materialIndex;
        const url = dice.material[faceIndex].userData.URL;
        window.location.href = url;
    }
}

init();
