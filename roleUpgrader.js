/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.memory.working == true && creep.carry.energy == 0) {
        creep.memory.working = false;
      }
      else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
      }

      if(creep.memory.working == true) {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }
      }
      else{

        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => s.structureType == STRUCTURE_CONTAINER
                      && s.store[RESOURCE_ENERGY] > 0
        });

        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
          filter: (d) => d.amount >= 100
        });

        // console.log(JSON.stringify(droppedEnergy));
        if(droppedEnergy.length) {
            var pickupDropped = creep.pickup(droppedEnergy[0]);
            // console.log(pickupDropped);
        }

        if(droppedEnergy.length > 0 && pickupDropped == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedEnergy[0]);
        }

        if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container)
          creep.say('⛋')
        }
          // var source = creep.pos.findClosestByPath(FIND_SOURCES);
          // if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          //   creep.moveTo(source);
          // }
        }

  }
};

module.exports = roleUpgrader;
