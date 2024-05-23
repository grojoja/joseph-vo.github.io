let scene, camera, renderer, pyramid;
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.ConeGeometry(1, 3, 4);  // Parameters: radius, height, num of segments
    const material = new THREE.MeshBasicMaterial({color: 0x6699CC, wireframe: true});
    pyramid = new THREE.Mesh(geometry, material);
    scene.add(pyramid);

    document.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    window.addEventListener('resize', onWindowResize, false);

    render();
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function startDrag(e) {
    isDragging = true;
}

function drag(e) {
    if (isDragging) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        const rotateAngleX = (deltaMove.x * Math.PI) / 360;
        const rotateAngleY = (deltaMove.y * Math.PI) / 360;

        pyramid.rotation.y += rotateAngleX;
        pyramid.rotation.x += rotateAngleY;
    }

    previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
}

function stopDrag() {
    isDragging = false;
}

init();
