let title = "Humming Bird";

//難易度
let difficulty_object = 3
let speed;
let timestamp = 0;

//状態
let musical_scale = ["ド", "ド♯", "レ", "レ♯", "ミ", "ファ", "ファ♯", "ソ", "ソ♯", "ラ", "ラ♯", "シ", "ド"];
let balloon_pos = [24, 68, 112, 156, 200, 244, 288, 332, 376, 420, 464, 508, 552];
let ranking = [0, 0, 0, 0, 0, 0];
let score = 0;
let spr, player, reset;
let i, j;
let tone, Cplus;
let sManager;

//フラグ
let ranking_flg = 0;
let position_flg = 0;
let gameover_flg = 0;
let menu_flg = 0;
let color_flg = 0;

let load_flg = 0;

let audioContext;
let mic, pitch, song;
let message = "ちょっと時間くれ";
let freq = 0;
let max_freq, min_freq;
let max_freq_str = "測定待ち";
let min_freq_str = "測定待ち";
let freq_str = "測定待ち"

let  balloon_img, player_img, bg, heart, img, cloud, font;

function preload() {
  song = loadSound("assets/haretu.mp3");
  balloon_img = loadAnimation("assets//fusen01.png", "assets//fusen02.png");
  bg = loadImage("assets//background.png");
  player_img = loadAnimation("assets//bird01.png",　"assets//bird02.png");
  heart = loadImage("assets//heart.png");
  img = loadImage("assets//bird.png");
  cloud = loadImage("assets//cloud.png");
  font = loadFont("assets//angrybirds-regular.ttf");
}

function setup() {
  createCanvas(1024, 576);
  background(0);
  frameRate(16);
  angleMode(DEGREES);
  rectMode(CENTER);
  fill(255, 255, 255);
  noStroke();

  // SceneManager
  sManager = new SceneManager();
  sManager.addScene(Scene1);
  sManager.addScene(Scene2);
  sManager.addScene(Scene3);
  sManager.addScene(Scene4);
  sManager.addScene(Scene5);
  sManager.showNextScene();
  
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
}

function draw() {
  // SceneManager
  sManager.draw();
}

function mousePressed() {
  // SceneManager
  sManager.mousePressed();
}

function startPitch() {
  pitch = ml5.pitchDetection('./model/', audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  message = "準備完了"
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency　&& 80 < frequency && frequency < 800) {
        freq = Math.floor(frequency);
    } else {
      freq = 0;
    }
    getPitch();
  })
}

function Scene1() {
  this.setup = function () {};

  this.draw = function () {
    background(150, 200, 255);
    fill(255, 255, 255);
    textAlign(CENTER);
    if(color_flg == 0) {
      textSize(86);
      color_flg = 1;
    } else { 
      textSize(84);
      color_flg = 0;
    }
    textFont(font);
    text(title, width * 0.5, height * 0.5 - 75);
    textFont('fontBold');
    textSize(48);
    text("スタート", width * 0.5, height * 0.5 + 30);


    image(img, 100, height * 0.5, img.width * 1.5, img.height * 1.5);
    image(cloud, 700, 250, cloud.width * 0.5, cloud.height * 0.5);
    
    position_flg = 0;
    ranking_flg = 0;
    gameover_flg = 0;
    score = 0;
    max_freq = 0;
    min_freq = 0;
    this.mousePressed = function () {
      this.sceneManager.showNextScene();
    };
      
  }
}

function Scene2() {
  this.setup = function () {};
  
  this.draw = function () {
    background(0, 200, 200);
    
    textAlign(CENTER);
    textSize(48);
    text("君の声の高さに合わせて", width * 0.5, height * 0.5 - 125);
    text("鳥が上へ下へと動くぞ", width * 0.5, height * 0.5 - 75);
    text("自分の声をうまく使って", width * 0.5, height * 0.5 - 25);
    text("右から流れてくる風船を取ろう！", width * 0.5, height * 0.5 + 25);
    text("クリックして録音スタート", width * 0.5, height * 0.5 + 150);

    this.mousePressed = function () {  
      this.sceneManager.showNextScene();
    }
  }
}

function Scene3() {
  
  this.setup = function () {};
  
  this.draw = function () {
    background(150, 150, 150);
    

    
    // 初期化
    if (freq != 0) {
      if (max_freq == 0) {
        max_freq = freq;
        min_freq = freq;

      } else {
        if (freq > max_freq) {
          max_freq = freq;
        }
        if (freq < min_freq) {
          min_freq = freq;
        }
      }
    }
    
    if (max_freq == 0) {
      max_freq_str = "測定待ち";
      min_freq_str = "測定待ち";
      freq_str = "測定待ち";
    } else {
      max_freq_str = str(max_freq);
      min_freq_str = str(min_freq);
      freq_str = str(freq);
    }
    
    if(freq == 0) {
      freq_str = "音声待ち";
    } else {
      freq_str = str(freq);
    }
    
    textAlign(CENTER);
    textSize(48);
    text(message, width * 0.5, height * 0.5 - 200)
    text("ドレミファソラシドと歌ってね", width * 0.5, height * 0.5 - 125);
    text("最高値: " + max_freq_str, width * 0.5, height * 0.5 - 50);
    text("最低値: " + min_freq_str, width * 0.5, height * 0.5 + 25);
    text("あなたの声: " + freq_str, width * 0.5, height * 0.5 + 100);
    text("終わったらクリック", width * 0.5, height * 0.5 + 200);
    textSize(32);
    text("ブラウザの再読み込みで測定のやり直し", width * 0.5, height * 0.5 + 250);
    
    if(max_freq != 0 && min_freq != 0){
      this.mousePressed = function () {
        this.sceneManager.showNextScene();
      }
    }
  }
}

function Scene4() {

  this.setup = function () {};

  this.draw = function () {
    background(bg);
    
    if (gameover_flg < 3){


      textSize(24);
      textAlign(CENTER);
      for (i = 0; i < 3 - gameover_flg; i++) {
        image(heart, width * 0.5 + 42 * (i - 2) + 20, 30);
      }
      stroke(0);
      strokeWeight(3);
      text("Score: " + str(score), width * 0.5, 20);

      
      for (i = 0; i < 13; i ++) {
        stroke(150, 200, 255);
        line(0, 24 + i * 44, width, 24 + i * 44);
      }
      textAlign(LEFT);
      for (i = 0; i < 13; i++) { 
        text(musical_scale[12 - i], 20, 30 + i * 44)
      }
      
      // 初期化
      if (position_flg == 0) {
          spr = Array(difficulty_object);
          player = createSprite(200, height / 2);
          player.addAnimation("default", player_img);

          for (i = 0; i < spr.length; i++) {
            spr[i] = createSprite(width / 2, height / 2);
            spr[i].addAnimation("default",  balloon_img);
            spr[i].position.x = random(width) + width;
            spr[i].position.y = balloon_pos[int(random()*13)];
        }
        freq = 0;
        position_flg = 1;
        speed = 5;

      }
    
      for (i = 0; i < spr.length; i++) {
        spr[i].setSpeed(speed, 180);
        
        if (spr[i].overlap(player)) {
          song.play();
          spr[i].position.x = 128 * 8;
          spr[i].position.y = balloon_pos[int(random()*13)];
          score += 10;
        }
        if (spr[i].position.x < 0) {
          spr[i].position.x = 128 * 8;
          spr[i].position.y = balloon_pos[int(random()*13)];
          gameover_flg += 1;
        }
        
      }
      temp = player.position.y

      
      if (millis() - timestamp > 20000) {
        timestamp = millis();
        speed += 3;
        console.log(speed);
      }
      
      if (freq > 80) {
        Cplus = (log(max_freq)/log(min_freq))-1;
        Tone = (log(freq)/log(min_freq))-1;
        player.position.y = int(height * (1 - (Tone)/Cplus));
      } 
      
      if (player.position.y < 0){
        player.position.y = 0;
      }
      
      if (player.position.y > height){
        player.position.y = height
      }
      
      drawSprites();

      
    } else {
      textAlign(CENTER);
      textSize(48);
      stroke(0);
      strokeWeight(3);
      fill(255, 255, 0)
      text("GAME OVER!!", width * 0.5, height * 0.5);
      text("クリックして結果を見る", width * 0.5, height * 0.5 + 75);
      
      for (i = 0; i < difficulty_object; i++){
        spr[i].remove()
      }
      player.remove()
      
      this.mousePressed = function () {
        this.sceneManager.showNextScene();
      }
    }
  }
}
  
function Scene5() {
  this.setup = function () {};

  this.draw = function () {
    background(100, 100, 200);
    textAlign(CENTER);
    textSize(48);
    text("あなたのスコアは " + score + " !!", width * 0.5, height * 0.5 - 75);
    textSize(32);
    text("クリックしてタイトルにもどる", width * 0.5, height * 0.5);
    menu_flg = 0;

    
    // 初期化
    if (ranking_flg == 0) {
      //ランキング更新
      ranking[5] = score;
      for (i = 0; i < 6; i++) {
        for (let j = 5; j > i; j--) {
          if (ranking[j] > ranking[j - 1]) {
            var tmp = ranking[j];
            ranking[j] = ranking[j - 1];
            ranking[j - 1] = tmp;
          }
        }
      }
      ranking_flg = 1;
    }

    for (i = 0; i < 5; i++) {
      textSize(24);
      fill(255, 255, 255);
      text("No." + (i + 1) + ", " + ranking[i], width * 0.5, height * 0.5 + (1.5 + i) * 40);
    }
  }

  this.mousePressed = function () {
    this.sceneManager.showNextScene();
  }
}