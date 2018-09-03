class Colony {
  constructor(name) {
    this.name = name
    // this.spawn = new Spawn(Game.spawns[name], this)
    this.spawn = new Spawn(Game.spawns[name])
    this.room = this.spawn.ref.room
    this.creeps = this.getCreepList() // list of creeps for this colony
  }

  tick() {
    for (let creep of this.creeps) {
      CreepHelper.runCreepRole(creep, this)
    }
  }

  getCreepList() {
    let list = Object.values(Game.creeps).filter(creep => creep.memory.colony === this.name)
    return list
  }
}
class Entity {
  constructor(ref, colony) {
    this.ref = ref
    this.colony = colony
  }
}
class Creep extends Entity {

  constructor(ref, colony) {
    super(ref, colony)
  }
  
}
class CreepHelper {

  static getCreepClass(className) {
    for (let creepRole of Config.ROLES) {
      if (className === creepRole.name) {
        return creepRole
      }
    }
  }

  static runCreepRole(creepRef, colony) {
    let creepClass = CreepHelper.getCreepClass(creepRef.memory.role)
    let creep = new creepClass(creepRef, colony)
    creep.tick()
  }

  static newCreepName() {
    let newName = Game.time
    return newName
  }
}
class BoxKicker extends Creep {

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    pickupEnergy();
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  pickupEnergy() {
    let container = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER
                  && s.store[RESOURCE_ENERGY] > 200
    });

    let droppedEnergy = this.ref.room.find(FIND_DROPPED_RESOURCES, {
      filter: (d) => d.amount >= 100
    });

    let pickupDropped;
    if(droppedEnergy.length) {
        pickupDropped = this.ref.pickup(droppedEnergy[0]);
        // console.log(pickupDropped);
    }

    if(droppedEnergy.length > 0 && pickupDropped == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(droppedEnergy[0]);
    }

    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.ref.moveTo(container)
      this.ref.say('⛋')
    }
  }
}
// class Gatherer extends Creep{
//
//   constructor(ref, colony) {
//     super(ref, colony)
//   }
//
//   pickupEnergy(creep) {
//     let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
//       filter: (s) => s.structureType == STRUCTURE_CONTAINER
//                   && s.store[RESOURCE_ENERGY] > 200
//     });
//
//     let droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
//       filter: (d) => d.amount >= 100
//     });
//
//     let pickupDropped;
//     if(droppedEnergy.length) {
//         pickupDropped = creep.pickup(droppedEnergy[0]);
//         // console.log(pickupDropped);
//     }
//
//     if(droppedEnergy.length > 0 && pickupDropped == ERR_NOT_IN_RANGE) {
//         creep.moveTo(droppedEnergy[0]);
//     }
//
//     if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//       creep.moveTo(container)
//       creep.say('⛋')
//     }
//   }
//
//   upgradeRoom(creep) {
//     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
//       creep.moveTo(creep.room.controller);
//     }
//   }
//
//   repairRoads(creep) {
//
//   }
//
// }
class Spawn extends Entity {
  constructor(ref, colony) {
    super(ref)
    this.colony = colony
  }

// spawnCreep(info, options) {
  spawnCreep(info) {
    // if (!options) options = {}
    // if (!options.memory) options.memory = {}

    let creepClass = CreepsHelper.getCreepClass(info.role)

    // options.memory.role = creepClass.name
    // options.memory.colony = this.colony.name

    if(creepClass === 'BoxKicker')
      if(this.ref.room.energyAvailable >= 550) {
        this.ref.spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
          'BoxKicker ' + newCreepName(),
          { memory: { colony: this.colony.name }})
      }
      else {
        this.ref.spawnCreep([CARRY,CARRY,MOVE,MOVE],
          'BoxKicker ' + newCreepName(),
          { memory: { colony: this.colony.name }})
      }
    }
    // spawn creep with colony variable in memory
}
class Config {
  constructor() {}

  static get COLONIES() {
    return ['Spawn-W1N8']
  }

  static get ROLES() {
    return [
      BoxKicker
    ]
  }
}
for (let colonyName of Config.COLONIES) {
  (new Colony(colonyName)).tick()
}
