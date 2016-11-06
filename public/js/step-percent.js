var prizes = [];
for(var i = 0; i < 9; i++){
	prizes.push({
		period: 'day',
		steps: (i - (i % 2)) * 2500 + 5000,
		description: 'A prize description. A really long description about stuff.',
		company: 'Company',
		type: i % 2 ? 'coupon' : 'employee'
	});

	prizes.push({
		period: 'week',
		steps: (i - (i % 2)) * 2500 + 5000,
		description: 'A shorter prize description.',
		company: 'Company',
		type: i % 2 == 0 ? 'coupon' : 'employee'
	});

	prizes.push({
		period: 'month',
		steps: (i - (i % 2)) * 2500 + 5000,
		description: 'A prize description that says you need x steps per day for a month.',
		company: 'Company',
		type: i % 2 ? 'coupon' : 'employee'
	});
}

var updateStepPercents = function(daySteps, weekSteps, monthSteps){
	Array.prototype.slice.call(document.querySelectorAll('.step-percent')).forEach(function(ind){
		var prize = prizes[ind.getAttribute('prize-id')];
		var steps = daySteps;
		if(prize.period == 'week') steps = weekSteps;
		if(prize.period == 'month') steps = monthSteps;

		var ratio = Math.min(1, steps / prize.steps);

		if(ratio == 1){
			ind.parentNode.parentNode.classList.remove('unachieved-background');
		}else{
			ind.parentNode.parentNode.classList.add('unachieved-background');
		}

		ind.children[0].style.height = 0.5 * ratio + 'rem';
		ind.children[1].style.height = 1.0 * ratio + 'rem';
		ind.children[2].style.height = 1.5 * ratio + 'rem';

		var green = ratio < 0.5 ? 20 + Math.floor(400 * ratio) : 220;
		var red = ratio > 0.5 ? 220 - Math.floor(400 * (ratio - 0.5)) : 220;

		ind.children[0].style.background = 
		ind.children[1].style.background =
		ind.children[2].style.background =
		`rgb(${red}, ${green}, 20)`;
	});
};

var sections = {
	coupon: {
		day: document.querySelector('#coupons-day'),
		week: document.querySelector('#coupons-week'),
		month: document.querySelector('#coupons-month')
	},
	employee: {
		day: document.querySelector('#employee-day'),
		week: document.querySelector('#employee-week'),
		month: document.querySelector('#employee-month')
	}
};

prizes = prizes.sort(function(a, b){ return a > b ? -1 : a == b ? 0 : 1});

prizes.forEach(function(prize, index){
	sections[prize.type][prize.period].insertAdjacentHTML('afterend', 
		`<div class="card">
			<div>
				<div class="step-percent" prize-id="${index}">
					<div class="pillar"></div>
					<div class="pillar"></div>
					<div class="pillar"></div>
				</div>
				<div>${prize.company} - ${prize.steps} Steps</div>
			</div>
			<div class="body">
				<div>${prize.description}</div>
				<button class="claim">Claim Prize</button>
			</div>
		</div>`
	);
});

setTimeout(function(){
	updateStepPercents(5000, 10600, 3650);
}, 1000);