var bugmush_imgs = [
  './img/L.jpg',
  './img/M.jpg'
]

var infosource_imgs = [
  './img/A.jpg',
  './img/B.jpg'
]

var forced_bugmush_imgs = [
  './img/Ls.jpg',
  './img/Ms.png'
]

var forced_info_imgs = [
  './img/As.jpg',
  './img/Bs.jpg'
]

/*var i, starredArr=[], TrialNums = 6, ASnums =0, BSnums=0, ExactBS, ExactAS;

// Define Starred Images
for(i=0; i < TrialNums ;i++){
	if (Math.random() < 0.5) {
		starredArr.push(forced_info_imgs[0]);
		ASnums+=1;
	}
	else {
		starredArr.push(forced_info_imgs[1]);
		BSnums+=1;
	}
}

var AS = ASnums*0.7, BS= BSnums*0.3;
if ((Math.round(AS) - AS) > ( AS - Math.floor(AS))){
	ExactAS = Math.floor(AS);
}
else {
	ExactAS = Math.round(AS);
}
if ((Math.round(BS) - BS) > ( BS - Math.floor(BS))){
	ExactBS = Math.floor(BS);
}
else {
	ExactBS = Math.round(BS);
}

// define left and right info imgs
var leftInfoImg, rightInfoImg, leftInfoImgs=[], rightInfoImgs=[];
for(i=0; i < TrialNums ; i++){
	if (Math.random() < 0.5){
		leftInfoImg = starredArr[i];
		if (leftInfoImg === "./img/As.jpg")
			rightInfoImg = infosource_imgs[1];
		else
			rightInfoImg = infosource_imgs[0];
		leftInfoImgs.push(leftInfoImg);
		rightInfoImgs.push(rightInfoImg);
	}
	else {
		rightInfoImg = starredArr[i];
		if (rightInfoImg === "./img/Bs.jpg")
			leftInfoImg = infosource_imgs[0];
		else
			leftInfoImg = infosource_imgs[1];
		leftInfoImgs.push(leftInfoImg);
		rightInfoImgs.push(rightInfoImg);
	}
}

// define left and right bugmush images
var leftBugImg, rightBugImg, leftBugImgs=[], rightBugImgs=[];
for(i=0; i < TrialNums ; i++){
	if (Math.random() < 0.5){
		leftBugImg = bugmush_imgs[0];
		rightBugImg = bugmush_imgs[1];
		leftBugImgs.push(leftBugImg);
		rightBugImgs.push(rightBugImg);
	}
	else {
		leftBugImg = bugmush_imgs[1];
		rightBugImg = bugmush_imgs[0];
		leftBugImgs.push(leftBugImg);
		rightBugImgs.push(rightBugImg);
	}
}

// define the result of each trial
var totalExactResults = ExactAS + ExactBS;
var ResultArr=[];
for (i=0; i < TrialNums ; i++){
	if (i < totalExactResults)
		ResultArr.push("Wingame");
	else
		ResultArr.push("Lossgame");
}
ResultArr.sort(function() { return 0.5 - Math.random() });

// define the value of bugmush imgs
var leftBugImgsVal=[], rightBugImgsVal=[];
for(i=0; i < TrialNums ; i++){
	if (Math.random() < 0.5){
		leftBugImgsVal.push(1);
		rightBugImgsVal.push(0);
	}
	else {
		leftBugImgsVal.push(0);
		rightBugImgsVal.push(1);
	}
}*/

var i, starredImgs=[], TrialNums = 6, ASnums =0, BSnums=0, ExactBS, ExactAS;
var leftInfoImg, rightInfoImg, leftInfoImgs=[], rightInfoImgs=[];
var leftBugImg, rightBugImg, leftBugImgs=[], rightBugImgs=[];
var ResultArr=[];

// Define Choice Types
var choicesArr=[];
for(i = 0; i < Math.round(TrialNums/2); i++){
    choicesArr.push("abforced");
}
for(i = 0; i < TrialNums - Math.round(TrialNums/2); i++){
	choicesArr.push("lmforced");
}
choicesArr.sort(function() { return 0.5 - Math.random() });

for(i=0; i < choicesArr.length ;i++){
	if (choicesArr[i] == "abforced") {
	
		// Define info starred imgs
		if (Math.random() < 0.5) {
			starredImgs.push(forced_info_imgs[0]);
			ASnums+=1;
		}
		else {
			starredImgs.push(forced_info_imgs[1]);
			BSnums+=1;
		}
		
		// Define left and right info imgs
		if (Math.random() < 0.5){
			leftInfoImg = starredImgs[i];
			if (leftInfoImg == "./img/As.jpg")
				rightInfoImg = infosource_imgs[1];
			else
				rightInfoImg = infosource_imgs[0];
			leftInfoImgs.push(leftInfoImg);
			rightInfoImgs.push(rightInfoImg);
		}
		else {
			rightInfoImg = starredImgs[i];
			if (rightInfoImg == "./img/Bs.jpg")
				leftInfoImg = infosource_imgs[0];
			else
				leftInfoImg = infosource_imgs[1];
			leftInfoImgs.push(leftInfoImg);
			rightInfoImgs.push(rightInfoImg);
		}
		
		// Define left and right bug imgs
		if (Math.random() < 0.5){
			leftBugImg = bugmush_imgs[0];
			rightBugImg = bugmush_imgs[1];
			leftBugImgs.push(leftBugImg);
			rightBugImgs.push(rightBugImg);
		}
		else {
			leftBugImg = bugmush_imgs[1];
			rightBugImg = bugmush_imgs[0];
			leftBugImgs.push(leftBugImg);
			rightBugImgs.push(rightBugImg);
		}
	}
	else if (choicesArr[i] == "lmforced") {
		// Define bugmush starred imgs
		if (Math.random() < 0.5) {
			starredImgs.push(forced_bugmush_imgs[0]);
		}
		else {
			starredImgs.push(forced_bugmush_imgs[1]);
		}
		
		// Define left and right bug imgs
		if (Math.random() < 0.5){
			leftBugImg = starredImgs[i];
			if (leftBugImg == "./img/Ls.jpg")
				rightBugImg = bugmush_imgs[1];
			else
				rightBugImg = bugmush_imgs[0];
			leftBugImgs.push(leftBugImg);
			rightBugImgs.push(rightBugImg);
		}
		else {
			rightBugImg = starredImgs[i];
			if (rightBugImg == "./img/Ls.jpg")
				leftBugImg = bugmush_imgs[1];
			else
				leftBugImg = bugmush_imgs[0];
			leftBugImgs.push(leftBugImg);
			rightBugImgs.push(rightBugImg);
		}
		
		// Define left and right info imgs
		if (Math.random() < 0.5){
			leftInfoImg = infosource_imgs[0];
			rightInfoImg = infosource_imgs[1];
			leftInfoImgs.push(leftInfoImg);
			rightInfoImgs.push(rightInfoImg);
		}
		else {
			leftInfoImg = infosource_imgs[1];
			rightInfoImg = infosource_imgs[0];
			leftInfoImgs.push(leftInfoImg);
			rightInfoImgs.push(rightInfoImg);
		}
	}
}

// define the value of bugmush imgs
var leftBugImgsVal=[], rightBugImgsVal=[];
for(i=0; i < TrialNums ; i++){
	if (Math.random() < 0.5){
		leftBugImgsVal.push(1);
		rightBugImgsVal.push(0);
	}
	else {
		leftBugImgsVal.push(0);
		rightBugImgsVal.push(1);
	}
}

// define the result of each trial in bmfoeced mode
var AS = ASnums*0.7, BS= BSnums*0.3, sumExactAS = 0, sumExactBS = 0, sumNoExact=0;
if ((Math.round(AS) - AS) > ( AS - Math.floor(AS)))
	ExactAS = Math.floor(AS);
else
	ExactAS = Math.round(AS);
if ((Math.round(BS) - BS) > ( BS - Math.floor(BS)))
	ExactBS = Math.floor(BS);
else
	ExactBS = Math.round(BS);

for (i=0; i < starredImgs.length ; i++){
	ResultArr.push("null");
}
for(i=0; i < ExactAS ; i++){
	for (var j=0; j < starredImgs.length ; j++){
		if(starredImgs[j] == "./img/As.jpg" && sumExactAS < ExactAS) {
			ResultArr[j] = "Wingame";
			sumExactAS += 1;
		}
	}
}
for(i=0; i < ExactBS ; i++){
	for (var j=0; j < starredImgs.length ; j++){
		if(starredImgs[j] == "./img/Bs.jpg" && sumExactBS < ExactBS) {
			ResultArr[j] = "Wingame";
			sumExactBS += 1;
		}
	}
}
for(i=0; i < (ASnums + BSnums) - (ExactBS + ExactAS) ; i++){
	for (var j=0; j < starredImgs.length ; j++){
		if((starredImgs[j] == "./img/Bs.jpg" || starredImgs[j] == "./img/As.jpg") && sumNoExact < ((ASnums + BSnums) - (ExactBS + ExactAS)) && ResultArr[j] == "null") {
			ResultArr[j] = "Lossgame";
			sumNoExact += 1;
		}
	}
}

// define the first round of trial to be forced choice or free choice
var FirstRound=[];
for(var i = 0; i < Math.round(TrialNums/2); i++){
    FirstRound.push("forced");
}
for(i = 0; i < TrialNums - Math.round(TrialNums/2); i++){
    FirstRound.push("free");
}

FirstRound.sort(function() { return 0.5 - Math.random() });

var other_conditioning_stimuli = [
{choice_type: choicesArr[0], first: FirstRound[0], selected: starredImgs[0], left_info_img: leftInfoImgs[0], left_info_image_type: "infosource", left_info_image_number: 0, right_info_img: rightInfoImgs[0], right_info_image_type: "infosource", right_info_image_number: 1, left_bug_img: leftBugImgs[0], left_bug_image_type: "bugmush", left_bug_image_number: 0, right_bug_img: rightBugImgs[0], right_bug_image_type: "bugmush", right_bug_image_number: 1, left_bug_img_val: leftBugImgsVal[0], right_bug_img_val: rightBugImgsVal[0], result: ResultArr[0], InfoAnswerNumber: 0, numberq: 1},
{choice_type: choicesArr[1], first: FirstRound[1], selected: starredImgs[1], left_info_img: leftInfoImgs[1], left_info_image_type: "infosource", left_info_image_number: 1, right_info_img: rightInfoImgs[1], right_info_image_type: "infosource", right_info_image_number: 0, left_bug_img: leftBugImgs[1], left_bug_image_type: "bugmush", left_bug_image_number: 1, right_bug_img: rightBugImgs[1], right_bug_image_type: "bugmush", right_bug_image_number: 0, left_bug_img_val: leftBugImgsVal[1], right_bug_img_val: rightBugImgsVal[1], result: ResultArr[1], InfoAnswerNumber: 1, numberq: 2},
{choice_type: choicesArr[2], first: FirstRound[2], selected: starredImgs[2], left_info_img: leftInfoImgs[2], left_info_image_type: "infosource", left_info_image_number: 0, right_info_img: rightInfoImgs[2], right_info_image_type: "infosource", right_info_image_number: 1, left_bug_img: leftBugImgs[2], left_bug_image_type: "bugmush", left_bug_image_number: 0, right_bug_img: rightBugImgs[2], right_bug_image_type: "bugmush", right_bug_image_number: 1, left_bug_img_val: leftBugImgsVal[2], right_bug_img_val: rightBugImgsVal[2], result: ResultArr[2], InfoAnswerNumber: 1, numberq: 3},
{choice_type: choicesArr[3], first: FirstRound[3], selected: starredImgs[3], left_info_img: leftInfoImgs[3], left_info_image_type: "infosource", left_info_image_number: 1, right_info_img: rightInfoImgs[3], right_info_image_type: "infosource", right_info_image_number: 0, left_bug_img: leftBugImgs[3], left_bug_image_type: "bugmush", left_bug_image_number: 1, right_bug_img: rightBugImgs[3], right_bug_image_type: "bugmush", right_bug_image_number: 0, left_bug_img_val: leftBugImgsVal[3], right_bug_img_val: rightBugImgsVal[3], result: ResultArr[3], InfoAnswerNumber: 0, numberq: 4},
{choice_type: choicesArr[4], first: FirstRound[4], selected: starredImgs[4], left_info_img: leftInfoImgs[4], left_info_image_type: "infosource", left_info_image_number: 0, right_info_img: rightInfoImgs[4], right_info_image_type: "infosource", right_info_image_number: 1, left_bug_img: leftBugImgs[4], left_bug_image_type: "bugmush", left_bug_image_number: 0, right_bug_img: rightBugImgs[4], right_bug_image_type: "bugmush", right_bug_image_number: 1, left_bug_img_val: leftBugImgsVal[4], right_bug_img_val: rightBugImgsVal[4], result: ResultArr[4], InfoAnswerNumber: 1, numberq: 5},
{choice_type: choicesArr[5], first: FirstRound[5], selected: starredImgs[5], left_info_img: leftInfoImgs[5], left_info_image_type: "infosource", left_info_image_number: 1, right_info_img: rightInfoImgs[5], right_info_image_type: "infosource", right_info_image_number: 0, left_bug_img: leftBugImgs[5], left_bug_image_type: "bugmush", left_bug_image_number: 1, right_bug_img: rightBugImgs[5], right_bug_image_type: "bugmush", right_bug_image_number: 0, left_bug_img_val: leftBugImgsVal[5], right_bug_img_val: rightBugImgsVal[5], result: ResultArr[5], InfoAnswerNumber: 0, numberq: 6},
]

/*var other_conditioning_stimuli = [
	{choice_type: "free", left_info_image_type: "infosource", left_info_image_number: 0, right_info_image_type: "infosource", right_info_image_number: 1, left_bug_image_type: "bugmush", left_bug_image_number: 0, right_bug_image_type: "bugmush", right_bug_image_number: 1, InfoAnswerNumber: 0, numberq: 1},
    {choice_type: "free", left_info_image_type: "infosource", left_info_image_number: 1, right_info_image_type: "infosource", right_info_image_number: 0, left_bug_image_type: "bugmush", left_bug_image_number: 1, right_bug_image_type: "bugmush", right_bug_image_number: 0, InfoAnswerNumber: 1, numberq: 2},
    {choice_type: "free", left_info_image_type: "infosource", left_info_image_number: 0, right_info_image_type: "infosource", right_info_image_number: 1, left_bug_image_type: "bugmush", left_bug_image_number: 0, right_bug_image_type: "bugmush", right_bug_image_number: 1, InfoAnswerNumber: 1, numberq: 3},
    {choice_type: "free", left_info_image_type: "infosource", left_info_image_number: 1, right_info_image_type: "infosource", right_info_image_number: 0, left_bug_image_type: "bugmush", left_bug_image_number: 1, right_bug_image_type: "bugmush", right_bug_image_number: 0, InfoAnswerNumber: 0, numberq: 4},
    {choice_type: "free", left_info_image_type: "infosource", left_info_image_number: 0, right_info_image_type: "infosource", right_info_image_number: 1, left_bug_image_type: "bugmush", left_bug_image_number: 0, right_bug_image_type: "bugmush", right_bug_image_number: 1, InfoAnswerNumber: 1, numberq: 5},
    {choice_type: "free", left_info_image_type: "infosource", left_info_image_number: 1, right_info_image_type: "infosource", right_info_image_number: 0, left_bug_image_type: "bugmush", left_bug_image_number: 1, right_bug_image_type: "bugmush", right_bug_image_number: 0, InfoAnswerNumber: 0, numberq: 6}
]*/