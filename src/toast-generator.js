/**
 *
 * @param min
 * @param max
 * @returns {number}
 */
function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

/**
 *
 * @param o
 * @returns {string}
 */
function getAsRGBString(o) {
  return 'rgb(' + Math.round(o.red) + ',' + Math.round(o.green) + ',' + Math.round(o.blue) + ')'
}

/**
 * Give me transparent background
 *
 * @returns {Array}
 */
function getTransparentBackground() {
  let a = [];
  for(let i=0; i < 16; i++) {
    a[i] = [];
    for(let j=0; j < 16; j++) {
      a[i][j] = 'rgba(255,255,255,0)'
    }
  }
  return a;
}

/**
 * Generate procedural matrix
 *
 * @returns {Array}
 */
export function generate() {

  let skinColor = {},
    noseColor = {},
    mouthColor = {},
    eyeColor = {},
    whiteEyeColor = {};

  let black = {
    red: 0,
    green: 0,
    blue: 0
  };

  // Skin
  if (randomIntFromInterval(0,5)) {
    // http://www.makehuman.org/forum/viewtopic.php?f=8&t=1529
    let red_multiplier = randomIntFromInterval(147,153)/100;
    let green_multiplier = randomIntFromInterval(147,153)/100;

    skinColor.blue = randomIntFromInterval(70, 200);
    skinColor.red = Math.min(255, skinColor.blue * red_multiplier);
    skinColor.green = Math.min(255, skinColor.blue * green_multiplier);
  } else {
    // Rare
    skinColor.red = randomIntFromInterval(220,255);
    skinColor.green = randomIntFromInterval(205,255);
    skinColor.blue = randomIntFromInterval(190,255);
  }

  // Nose and mouth
  let blue_coefficient = randomIntFromInterval(20, 70);
  noseColor.blue = Math.max(16, skinColor.blue - blue_coefficient);
  noseColor.red = noseColor.blue * 1.5;
  noseColor.green = noseColor.blue * 1.15;

  mouthColor.red = skinColor.red - randomIntFromInterval(0, blue_coefficient);
  mouthColor.blue = noseColor.blue;
  mouthColor.green = noseColor.green;

  // Eyes
  if (randomIntFromInterval(0,1)) {
    eyeColor = {
      red: 0,
      green: 0,
      blue: randomIntFromInterval(16,200)
    };
  } else {
    eyeColor = {
      red: 0,
      green: randomIntFromInterval(16,200),
      blue: 0
    };
  }

  whiteEyeColor = {
    red: Math.max(16, (skinColor.red + 255)/2),
    green: Math.max(16, (skinColor.green + 255)/2),
    blue: Math.max(16, (skinColor.blue + 255)/2)
  };

  let face = getTransparentBackground();

  // Face Shape - YOLO
  let i, i_l, j= 0, j_l, j_l2;

  for (i = 0, i_l = randomIntFromInterval(3,5); i < i_l; i++) {
    face[1][7-i] = face[1][8+i] = getAsRGBString(black);
  }
  face[2][7-i_l] = face[2][8+i_l] = getAsRGBString(black);
  for(i = 7-i_l+1; i< 8+i_l; i++) face[2][i] = getAsRGBString(skinColor);
  if (randomIntFromInterval(0, 1)) {
    face[2][7-i_l-1] = face[2][8+i_l+1] = getAsRGBString(black);
    i_l++;
  }
  face[3][7-i_l-1] = face[3][8+i_l+1] = getAsRGBString(black);
  for(i = 7-i_l; i< 8+i_l+1; i++) face[3 + j][i] = getAsRGBString(skinColor);
  for(j = 0, j_l = randomIntFromInterval(3,7); j < j_l; j++) {
    face[4 + j][7-i_l-1] = face[4 + j][8+i_l+1] = getAsRGBString(black);
    for(i = 7-i_l; i< 8+i_l+1; i++) face[4 + j][i] = getAsRGBString(skinColor);
  }
  for(j = 0, j_l2 = 8-j_l; j < j_l2; j++) {
    face[4 + j_l + j][7-i_l] = face[4 + j_l + j][8+i_l] = getAsRGBString(black);
    for(i = 7-i_l+1; i< 8+i_l; i++) face[4 + j_l + j][i] = getAsRGBString(skinColor); // skin
  }
  face[12][7-i_l+1] = face[12][8+i_l-1] = getAsRGBString(black);
  for(i = 7-i_l+2; i< 8+i_l-1; i++) face[12][i] = getAsRGBString(skinColor); // skin
  let mod = randomIntFromInterval(1,2);
  face[13][7-i_l+mod] = face[13][8+i_l-mod] = getAsRGBString(black);
  for(i = 7-i_l+mod+1; i< 8+i_l-mod; i++) face[13][i] = getAsRGBString(skinColor); // skin
  for (i = 0, i_l = i_l-mod; i < i_l; i++) {
    face[14][7-i] = face[14][8+i] = getAsRGBString(black);
  }

  // Eyes
  let eye_x = randomIntFromInterval(-1,1);
  let eye_y = randomIntFromInterval(-1,1);
  face[5+eye_y][5+eye_x] = face[5+eye_y][10-eye_x] = getAsRGBString(eyeColor);
  if (randomIntFromInterval(0,1) == 1 && eye_x<1) {
    face[5+eye_y][5+eye_x+1] = face[5+eye_y][10-eye_x-1] = getAsRGBString(eyeColor);
    face[5+eye_y][5+eye_x+randomIntFromInterval(0,1)] = face[5+eye_y][10-eye_x-randomIntFromInterval(0,1)] = getAsRGBString(whiteEyeColor);
  }

  // Nose
  let nose_y = randomIntFromInterval(0,2);
  face[7+nose_y][7] = face[7+nose_y][8] = getAsRGBString(noseColor);
  let abs_nose_y = 7+nose_y;

  // Mouth
  let mouth_type = randomIntFromInterval(0,5);
  let mouth_y, mouth_l_x, mouth_length;
  if (mouth_type < 4) {
    if (randomIntFromInterval(0,1)) {
      mouth_y = abs_nose_y + randomIntFromInterval(0,3);
    } else {
      mouth_y = abs_nose_y + 2 + randomIntFromInterval(0,1);
    }
    if (mouth_y == nose_y +1 && randomIntFromInterval(0,5) < 4) {
      mouth_y +=1;
    }
    for (i = 0, mouth_l_x = randomIntFromInterval(1,3); i < Math.min(i_l, mouth_l_x); i++) {
      face[mouth_y][7-i] = face[mouth_y][8+i] = getAsRGBString(mouthColor);
    }
  } else if (mouth_type == 4) {
    mouth_y = abs_nose_y + 2 + randomIntFromInterval(0,1);
    mouth_length = randomIntFromInterval(1,3);
    face[mouth_y][7-mouth_length+1] = face[mouth_y][8+mouth_length-1] = getAsRGBString(mouthColor);
    for (i = 0, mouth_l_x = mouth_length -1; i < Math.min(i_l, mouth_l_x); i++) {
      face[1+mouth_y][7-i] = face[1+mouth_y][8+i] = getAsRGBString(mouthColor);
    }
  } else {
    mouth_y = abs_nose_y + 2 + randomIntFromInterval(0,1);
    mouth_length = randomIntFromInterval(1,3);
    for (i = 0, mouth_l_x = mouth_length -1; i < Math.min(i_l, mouth_l_x); i++) {
      face[mouth_y][7-i] = face[mouth_y][8+i] = getAsRGBString(mouthColor);
    }
    face[1+mouth_y][7-i] = face[1+mouth_y][8+i] = getAsRGBString(mouthColor);
  }

  return face;

}

/**
 *
 * @returns {Element}
 */
export function getAsImage() {

  let face = generate();

  let canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  let ctx = canvas.getContext("2d");

  for(let i=0; i < 16; i++) {
    for(let j=0; j < 16; j++) {
      ctx.fillStyle = face[i][j];
      ctx.fillRect( j, i, 1, 1 );
    }
  }

  var img = document.createElement("img");
  img.src = canvas.toDataURL("image/png");

  return img;
}