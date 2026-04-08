const fs = require('fs');
const path = require('path');

const expoModules = [
  'expo-firebase-analytics',
  'expo-network',
  'expo-firebase-core',
  'expo-constants',
  'expo-cellular',
  'expo-document-picker',
  'expo-modules-core',
  'expo-file-system',
  'expo-splash-screen'
];

const nodeModulesPath = path.join(__dirname, 'node_modules');

expoModules.forEach(module => {
  const buildGradlePath = path.join(nodeModulesPath, module, 'android', 'build.gradle');
  
  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Replace 'maven' plugin with 'maven-publish'
    content = content.replace(
      /apply plugin: 'maven'/g,
      "apply plugin: 'maven-publish'"
    );
    
    // Replace uploadArchives with publishing block
    content = content.replace(
      /uploadArchives\s*\{[\s\S]*?repositories\s*\{[\s\S]*?mavenDeployer\s*\{[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}/g,
      `publishing {
  publications {
    aarArchive(MavenPublication) {
      groupId 'host.exp.exponent'
      artifactId '${module}'
      version '${require(path.join(nodeModulesPath, module, 'package.json')).version}'
      artifact("\$buildDir/outputs/aar/\${project.getName()}-release.aar")
      artifact androidSourcesJar
    }
  }
  repositories {
    maven {
      url = uri("\$buildDir/repo")
    }
  }
}`
    );
    
    fs.writeFileSync(buildGradlePath, content, 'utf8');
    console.log(`✓ Fixed ${module}`);
  } else {
    console.log(`✗ ${module} not found`);
  }
});

console.log('\nAll expo modules fixed!');
