function getRandomValue(max,min){
    return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
    data(){
        return{
            playerAtt:{
                maxHealth:100,
                health:100,
                minAttack:5,
                maxAttck:12,
                skill: {
                    cooldown:3,
                    usedAtRound:0,
                },
                heal:20,
            },
            monsterAtt:{
                maxHealth:100,
                health:100,
                minAttack:3,
                maxAttck:15,
                critChance:30,
                critMultiplier:2,
            },
            currentRound:1,
            takeAction:true,
            playerTurn:true,
            gameOver:false,
        };
    },
    computed:{
        playerHealthPercentage(){
            if(this.playerAtt.health >= 0){
                return (this.playerAtt.health / this.playerAtt.maxHealth) * 100 + '%';
            } else {
                return '0%';
            }
        },
        monsterHealthPercentage(){
            if(this.monsterAtt.health >= 0){
                return (this.monsterAtt.health / this.monsterAtt.maxHealth) * 100 + '%';
            } else{
                return '0%';
            }
        },
        specialAttackReady(){
            if(this.playerAtt.skill.usedAtRound === 0 ){
                return false;
            }else{
                return this.currentRound - this.playerAtt.skill.usedAtRound > this.playerAtt.skill.cooldown ? false : true;
            }
        },
        winStatus(){
            if(this.monsterAtt.health<=0){
                return "Human Win";
            }else if(this.playerAtt.health<=0){
                return "Monster Win";
            }
        },         
        winStatusClasses(){
            if(this.monsterAtt.health<=0){
                return {
                    'win-text':true,
                };
            }else if(this.playerAtt.health<=0){
                return {
                    'lost-text':true,
                };
            }
        },
    },
    watch: {
        playerHealthPercentage(){
            this.playerAtt.health > this.playerAtt.maxHealth ? this.playerAtt.health = this.playerAtt.maxHealth : '';
        },
        playerTurn(){
            
            this.gameOver? console.log("gameover"): console.log("not game over");;
            if(this.playerTurn == false && this.gameOver==false) {
                // console.log("prepare monster attack");
                this.attackToPlayer();
                this.playerTurn = !this.playerTurn;
            }
        },
        winStatus(){
            if(this.monsterAtt.health<=0){
                this.gameOver=true;
            }else if(this.playerAtt.health<=0){
                this.gameOver=true;
            }
        }
    },
    methods: {
        attackToMonster(){
            // check if either one died gameOver take no action
            if ( this.gameOver){
                return;
            }
            
            // generate player attack value to monster
            attackValue = getRandomValue(this.playerAtt.maxAttck,this.playerAtt.minAttack);
            
            // reduce monster health
            this.monsterAtt.health -= attackValue;

            //end player turn 
            this.playerTurn = !this.playerTurn;
            // console.log("player turn"+this.playerTurn);
            
        },
        attackToPlayer(){
            // give player access to do action
            this.takeAction = !this.takeAction;
            
            // delay to see the action
            setTimeout(()=>{
                console.log("monster attack");

                // generate player monster value to player
                attackValue = getRandomValue(this.monsterAtt.maxAttck,this.monsterAtt.minAttack);
                
                // crit chance
                if(this.isCriticalHits(this.monsterAtt.critChance) == true) {
                    attackValue *= this.monsterAtt.critMultiplier;
                    console.log("monster land crit hit for "+ attackValue + " damage");
                }
                
                // reduce player health
                this.playerAtt.health -= attackValue;
                
                // increase round
                this.currentRound++;
                this.takeAction = !this.takeAction;
            },1000);
        },
        isCriticalHits(probability){
            chance = Math.random() * 100;
            if(chance <= probability){
                return true;
            } else{
                return false;
            }
        },
        specialAttackToMonster(){
            // check if either one died gameOver take no ac
            if ( this.gameOver){
                return;
            }

            this.playerAtt.skill.usedAtRound = this.currentRound;
            console.log(this.playerAtt.skill.usedAtRound);
            
            // apply crit damage
            attackValue = getRandomValue(this.playerAtt.maxAttck,this.playerAtt.minAttack);
            attackValue*=1.9;

            this.monsterAtt.health-=attackValue;

            //end player turn 
            this.playerTurn = !this.playerTurn;
        },
        healPlayer(){
            // check if either one died gameOver take no ac
            if ( this.gameOver){
                return;
            }

            this.playerAtt.health += this.playerAtt.heal;

            //end player turn 
            this.playerTurn = !this.playerTurn;
            console.log("healed");
        }
        
    }
});

app.mount('#game');