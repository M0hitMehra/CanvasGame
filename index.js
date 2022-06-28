if(window.innerWidth < 600){
   alert("For best user Experience (and Using different weapons) Please switch to pc")
   
}

const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");


introMusic.play()
//canvas SetUp
const canvas = document.createElement("canvas");

const guide = document.querySelector(".guide")

setTimeout(() => {
  guide.style.display="none"
}, 2000);


document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;

const context = canvas.getContext("2d");

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
const lightWeaponDamage = 10;
const HeavyWeaponDamage = 30;
let playerScore = 0;

//functions

//Plasy Mode Basic Functions
document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();

  introMusic.pause();

  form.style.display = "none"; //Making the form invisible after selecting difficulty
  scoreBoard.style.display = "block"; //Making the scoreBoard visible after selecting difficulty

  const userValue = document.querySelector("#difficulty").value; //DIfficulty Selector

  if (userValue === "Easy") {
    setInterval(spawnEnemy, 2000);
    return (difficulty = 5);
  }
  if (userValue === "Medium") {
    setInterval(spawnEnemy, 1400);
    return (difficulty = 8);
  }
  if (userValue === "Hard") {
    setInterval(spawnEnemy, 1000);
    return (difficulty = 10);
  }
  if (userValue === "Insane") {
    setInterval(spawnEnemy, 700);
    return (difficulty = 12);
  }
});

const gameOverLoader = () => {
  const gameOverBanner = document.createElement("div");
  const gameOverBtn = document.createElement("button");
  const highScore = document.createElement("div");

  gameOverBtn.innerText = "Play Again";

  gameOverBanner.appendChild(highScore);
  gameOverBanner.appendChild(gameOverBtn);

  highScore.innerText = `High Score : ${
    localStorage.getItem("highScore")
      ? localStorage.getItem("highScore")
      : playerScore
  }`;

  const oldHighScore =
    localStorage.getItem("highScore") && localStorage.getItem("highScore");

  if (oldHighScore < playerScore) {
    localStorage.setItem("highScore", playerScore);
    highScore.innerHTML = `High Score : ${playerScore}`;
  }

  gameOverBtn.onclick = () => {
    window.location.reload();
  };

  gameOverBanner.classList.add("gameOver");

  document.querySelector("body").appendChild(gameOverBanner);
};

//-----------------------------------Player Enemy Weapon Classes--------------------------------

//-----------------------------------SETTING PLAYER AT cENTRE
const playerPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

//--------------------------PlAYER
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360
    );

    context.fillStyle = this.color;

    context.fill();
  }
}

//----------------------wEAPON
class Weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }

  draw() {
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360
    );

    context.fillStyle = this.color;

    context.fill();
  }

  update() {
    this.draw();
    (this.x += this.velocity.x), (this.y += this.velocity.y);
  }
}

//----------------------Huge wEAPON
class HugeWeapon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "rgba(47,255,0,1)";
  }

  draw() {
    context.beginPath();

    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 200, canvas.height);
  }

  update() {
    this.draw();
    this.x += 20;
  }
}

//----------------------

//----------------------Enemy Class
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360
    );

    context.fillStyle = this.color;

    context.fill();
  }

  update() {
    this.draw();
    (this.x += this.velocity.x), (this.y += this.velocity.y);
  }
}

//----------------------Particle Class

const fraction = 0.99;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    context.save();

    context.globalAlpha = this.alpha;
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360
    );

    context.fillStyle = this.color;

    context.fill();

    context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= fraction;
    this.velocity.y *= fraction;
    (this.x += this.velocity.x),
      (this.y += this.velocity.y),
      (this.alpha -= 0.01);
  }
}

//----------------------Game Main Logic {Player , spawing Enemy ,  }

//Creaing Player
const mohit = new Player(playerPosition.x, playerPosition.y, 15, "white");

const weapons = [];
const enemies = [];
const particles = [];
const hugeWeapons = [];

//function to spawn Enemy
const spawnEnemy = () => {
  const enemySize = Math.random() * (40 - 5) + 5; //generating enemy size

  //Generating enemy different Color
  const enemyColor = `hsl(${Math.floor(Math.random() * 360)},100% ,50%)`;

  //Creating Enemy at random position
  let random;
  if (Math.random() < 0.5) {
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    };
  }

  const myAngle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x
  );

  const velocity = {
    x: Math.cos(myAngle) * difficulty,
    y: Math.sin(myAngle) * difficulty,
  };

  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

//creating Animation
let animationId;
function animation() {
  animationId = requestAnimationFrame(animation);

  scoreBoard.innerHTML = `Score : ${playerScore}`;

  //   context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(49,49,49,0.1)";

  context.fillRect(0, 0, canvas.width, canvas.height);

  mohit.draw(); //Draw Player

  //generating Huge weapon

  hugeWeapons.forEach((hugeWeapon, hugeWeaponIndex) => {
    if (hugeWeapon.x > canvas.width) {
      hugeWeapons.splice(hugeWeaponIndex, 1);
    } else {
      hugeWeapon.update();
    }
  });

  //generating Bullets
  weapons.forEach((weapon, weaponIndex) => {
    weapon.update();

    //generating Particles
    particles.forEach((particle, particleIndex) => {
      if (particle.alpha < 0) {
        particles.splice(particleIndex, 1);
      }

      particle.update();
    });

    //removing offscrean Beams
    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });

  //generating Enimies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    const distanceBetweenEnemyAndPlayer = Math.hypot(
      mohit.x - enemy.x,
      mohit.y - enemy.y
    );

    //Game Over
    if (distanceBetweenEnemyAndPlayer - mohit.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
      gameOverSound.play()
      hugeWeaponSound.pause();
      shootingSound.pause()
      heavyWeaponSound.pause();
      killEnemySound.pause();
      return gameOverLoader();
    }

    hugeWeapons.forEach((hugeWeapon) => {
      const distanceBetweenHugeWeapomAndEnemy = hugeWeapon.x - enemy.x;

      if (
        distanceBetweenHugeWeapomAndEnemy <= 200 &&
        distanceBetweenHugeWeapomAndEnemy >= -200
      ) {
        //player increases and rendering
        playerScore += 10;
        scoreBoard.innerHTML = `Score : ${playerScore}`;
        setTimeout(() => {
          killEnemySound.play();

          enemies.splice(enemyIndex, 1);
        }, 0);
      }
    });

    weapons.forEach((weapon, weaponIndex) => {
      const distanceBetweenEnemyAndWeapon = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );

      if (distanceBetweenEnemyAndWeapon - weapon.radius - enemy.radius < 1) {

        killEnemySound.play();


        //Reducing Enemy after hit or killing it
        if (enemy.radius > weapon.damage + 8) {
          gsap.to(enemy, {
            radius: enemy.radius - weapon.damage,
          });

          setTimeout(() => {
            weapons.splice(weaponIndex, 1);
          }, 0);
        } else {
          for (let i = 0; i < enemy.radius * 2; i++) {
            particles.push(
              new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                x: (Math.random() - 0.5) * (Math.random() * 5),
                y: (Math.random() - 0.5) * (Math.random() * 5),
              })
            );
          }

          //playerScore increases and rendering
          playerScore += 10;
          scoreBoard.innerHTML = `Score : ${playerScore}`;
          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
      }
    });
  });
}

//Adding Event Listner

//Event Listner for Light Weapon
canvas.addEventListener("click", (e) => {

  shootingSound.play()

  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(myAngle) * 6,
    y: Math.sin(myAngle) * 6,
  };

  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      5,
      "white",
      velocity,
      lightWeaponDamage
    )
  );
});

//Event Listner for Heavy Weapon
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  
  if (playerScore < 2) return;
  heavyWeaponSound.play()

  playerScore -= 2;
  scoreBoard.innerHTML = `Score : ${playerScore}`;

  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  const velocity = {
    x: Math.cos(myAngle) * 3,
    y: Math.sin(myAngle) * 3,
  };

  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      20,
      "cyan",
      velocity,
      HeavyWeaponDamage
    )
  );
});

//huge Weapon
addEventListener("keypress", (e) => {
  if (e.key === " ") {
    if (playerScore < 20) return;
    hugeWeaponSound.play()
    playerScore -= 20;
    scoreBoard.innerHTML = `Score : ${playerScore}`;

    hugeWeapons.push(new HugeWeapon(0, 0));
  }
});

addEventListener("context-menu", (e) => {
  e.preventDefault();
});

addEventListener("resize", (e) => {
  window.location.reload();
});

animation();
