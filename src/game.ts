/*
    declarations
*/

//for any coordinate tuple, (x,y) is true

const heart_dist = 200;
const home_dist = 300;

const heart_size = 40;
const home_size = 40;

const card_height = 20;
const card_width = 15;

const turn = 2*Math.PI;

enum Dir {
    Up = 0, Left = 1, Down = 2, Right = 3
}

enum CardType {
    Normal = 0, NonLethal = 1, Discard = 2, Double = 3
}

enum Connection {
    None = 0, Normal = 1, Graphed = 2
}

interface Card {
    parent: Dir[],
    children: [(Card|null), (Card|null), (Card|null), (Card|null)],
    rot: number, //rotation in radians
    at: [number, number],
    str: number, //strength should be 0,1,2
    type: CardType,
    connections: [Connection, Connection, Connection, Connection],
    player: number,
    id: number,
}

interface Player {
    heart: [number, number],
    home: [number, number],
    root: Card[],
    hand: Card[],
}

/*
    Create a new game of 'player_count' players
*/

function new_game(player_count: number): Player[] {
    let players: Player[] = [];
    //init players
    let center = [0,0];
    let deltaTheta = turn/player_count;
    for(let i = 0; i < player_count; i++) {
        players.push({heart: [0, 0], home: [0, 0], root: [], hand: []});

        players[i].heart[0] += heart_dist * Math.cos(deltaTheta*i);
        players[i].heart[1] += heart_dist * Math.sin(deltaTheta*i);
        
        players[i].home[0] += home_dist * Math.cos(deltaTheta*i);
        players[i].home[1] += home_dist * Math.sin(deltaTheta*i);
    }
    return players;
}

/*
    Play the game
*/

var players: Player[] = []; //this should be a list of players for the current game; ASSIGN MANUALLY

//given a location of connection 'at' and what connection it is ('dir') as well as rotation 'rot' of a card, 
// find the location of the center of the card
function get_center_of_card(at: [number,number], dir: Dir, rot: number): [number,number] {
    let final_pos: [number, number] = [at[0],at[1]];
    if(dir == Dir.Up) {
        final_pos[1] -= (card_height/2) * Math.sin(rot);
    } else if(dir == Dir.Down) {
        final_pos[1] += (card_height/2) * Math.sin(rot);
    } else if(dir == Dir.Left) {
        final_pos[0] += (card_width/2) * Math.cos(rot);
    } else {
        final_pos[0] -= (card_width/2) * Math.cos(rot);
    }
    return final_pos;
}

//return if it's possible to put a new_card at an at_card on specified connections
function check_put_card_connection(new_card: Card, new_dir: Dir, at_card: Card, at_dir: Dir): boolean {
    if(at_card.children[at_dir] != null) return false;
    if(new_card.connections[new_dir] == Connection.Graphed || at_card.connections[at_dir] == Connection.Graphed) return true;
    if(new_card.connections[new_dir] == Connection.Normal && at_card.connections[at_dir] == Connection.Normal) return true;
    return false;
}


//return a list of intersections of card 'new_card' if it was put down
function check_put_card_collision(new_card: Card, dir: Dir, at: [number,number], rot: number): (Card[]|null) {
    let intersections: Card[] = [];
    //find intersections
    for(let p = 0; p < players.length; p++) {
        //for every player

    }
    //see if they all are smaller
    return null;
}

//put down a card without any legality checks
//'at' should be position of 'new_dir' connection of 'new_card'
function put_card(new_card: Card, new_dir: Dir, at_card: Card, at_dir: Dir, new_at: [number,number], new_rot: number, 
    connect_card: (Card|null) = null, connect_dir: (Dir|null) = null, connect_new_dir: (Dir|null) = null) {
    at_card.children[at_dir] = new_card;
    new_card.children[new_dir] = at_card;
    new_card.parent = [new_dir];
    new_card.rot = new_rot;
    new_card.at = get_center_of_card(new_at, new_dir, new_rot);
    //it closes a loop
    
}

function remove_cards(new_card: Card, overlapped: Card[], remove_callback: (id: number)=>void) {
}

/*
    Helper functions
*/

//cb = call back
function _from_core_forward(home: Card[], cb: (c: Card)=>void) {
    let ht = {};
    for(let i = 0; i < home.length; i++) {
        _forward(home[i], ht, cb);
    }
}

//ht = hash table = js object
//cb = call back
function _forward(root: Card, ht: Object, cb: (c: Card)=>void) {
    if(ht.hasOwnProperty(root.id)) return; //already visited
    cb(root);
    if(root.parent.length > 1) ht[root.id] = true;
    for(let i = 0; i < 4; i++) {
        if(root.children[i] != null && !_contains(root.parent, i)) {
            _forward(root.children[i]!, ht, cb);
        }
    }
}

function _contains(list: Dir[], dir: Dir): boolean {
    if(list.length == 1) return dir == list[0];
    if(list.length == 2) return dir == list[0] || dir == list[1];
    if(list.length == 3) return dir == list[0] || dir == list[1] || dir == list[2];
    return dir == list[0] || dir == list[1] || dir == list[2] || dir == list[3];
}