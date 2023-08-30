import {loadGLTF} from "../../libs/loader.js";
import * as THREE from 'three';
import {MindARThree} from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/flowertargets.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const butterfly1 = await loadGLTF('../../assets/models/butterfly1.gltf');
    butterfly1.scene.scale.set(0.12, 0.12, 0.12);
    butterfly1.scene.position.set(-0.4, 0, 0);

    const monster1 = await loadGLTF('../../assets/models/monster3.gltf');
    monster1.scene.scale.set(0.1, 0.1, 0.1);
    monster1.scene.position.set(0, 0, 0);

    const anchor1 = mindarThree.addAnchor(0);
    anchor1.group.add(butterfly1.scene); 

    const anchor2 = mindarThree.addAnchor(1);
    anchor2.group.add(monster1.scene);

    const butterflyMixer = new THREE.AnimationMixer(butterfly1.scene);
    const butterflyAction = butterflyMixer.clipAction(butterfly1.animations[0]);
    butterflyAction.play();

    const monsterMixer = new THREE.AnimationMixer(monster1.scene);
    const monsterAction = monsterMixer.clipAction(monster1.animations[0]);
    monsterAction.play();

    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      butterflyMixer.update(delta);
      monsterMixer.update(delta);
      renderer.render(scene, camera);
    });
  };

  start();
});
