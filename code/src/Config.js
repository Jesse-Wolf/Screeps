class Config {
  constructor() {}

  static get COLONIES() {
    return ['Spawn-W1N8']
  }

  static get ROLES() {
    return [Gatherer,BoxKicker, Builder, RepairMan, Miner, Upgrader]
  }
}
