/*
 * @Author: hvvvvvv- 1264178545@qq.com
 * @Date: 2023-07-04 02:41:51
 * @LastEditors: hvvvvvv- 1264178545@qq.com
 * @LastEditTime: 2023-07-04 16:28:33
 * @FilePath: \exercise\script.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */

// Scene
const scene = new THREE.Scene()

// red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 400,
  height: 300
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 7;
camera.position.x = 1;
scene.add(camera);


// render
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);