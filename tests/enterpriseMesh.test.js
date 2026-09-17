const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { LegalTopologyService } = require('../engine/legalTopologyService.js');

describe('NyayaNode: Enterprise Jurisprudence Mesh & Statutory Batch Engine', () => {
  let service;

  beforeEach(() => {
    service = new LegalTopologyService();
  });

  describe('Statutory Entity Lifecycle & Cascading Integrity', () => {
    it('retrieves pre-loaded BNS 2023 statutory mappings', () => {
      const statutes = service.getAllStatutes();
      assert.ok(statutes.length >= 5);
      const murder = service.getStatuteByBns('103(1)');
      assert.ok(murder);
      assert.strictEqual(murder.ipcSection, 'IPC 302');
      assert.strictEqual(murder.bailability, 'Non-Bailable');
    });

    it('creates new statutory mapping', () => {
      const statute = service.createStatute({
        bnsSection: 'BNS 111(1)',
        ipcSection: 'New (Organized Crime)',
        offenseTitle: 'Organized Crime Syndicate Operation',
        bailability: 'Non-Bailable',
        cognizable: true,
        punishment: 'Death or Life Imprisonment and Fine',
        court: 'Special Court / Session'
      });
      assert.strictEqual(statute.bnsSection, 'BNS 111(1)');
      assert.ok(service.getStatuteByBns('111(1)'));
    });

    it('cascades deletion: deleting a statute severs all connected dependency corridors', () => {
      const initialCorridors = service.getAllCorridors();
      const connected = initialCorridors.filter(c => c.sourceStatute.includes('103(1)') || c.targetStatute.includes('103(1)'));
      assert.ok(connected.length > 0);

      const deleted = service.deleteStatute('BNS 103(1)');
      assert.strictEqual(deleted, true);
      assert.strictEqual(service.getStatuteByBns('BNS 103(1)'), undefined);

      // Verify connected corridors were severed
      const remainingCorridors = service.getAllCorridors();
      const stillConnected = remainingCorridors.filter(c => c.sourceStatute.includes('103(1)') || c.targetStatute.includes('103(1)'));
      assert.strictEqual(stillConnected.length, 0);
    });

    it('executes universal statute purge and cascading link severance', () => {
      const count = service.deleteAllStatutes();
      assert.ok(count > 0);
      assert.strictEqual(service.getAllStatutes().length, 0);
      assert.strictEqual(service.getAllCorridors().length, 0);
    });
  });

  describe('Precedent Corridors & Telemetry', () => {
    it('calculates legal adherence telemetry metrics', () => {
      const metrics = service.getMetrics();
      assert.strictEqual(metrics.totalCorridors, service.getAllCorridors().length);
      assert.ok(metrics.activeCorridors > 0);
      assert.ok(metrics.avgStatutoryAdherencePct >= 98);
      assert.strictEqual(metrics.statutoryRegime, 'BNS 2023 / BNSS / BSA');
    });

    it('provisions new precedent corridor', () => {
      const corridor = service.provisionCorridor({
        sourceStatute: 'BNS 111 Organized Crime',
        targetStatute: 'Special MCOCA Precedents',
        jurisdictionLevel: 'Designated Special Court',
        bindingPrecedent: 'State of Maharashtra v. Bharat Shanti Lal Shah (2008) 13 SCC 5',
        statutoryAdherencePct: 99.7
      });
      assert.ok(corridor.id);
      assert.strictEqual(service.getAllCorridors().length, 6);
    });

    it('severs legal escalation corridor', () => {
      const corridors = service.getAllCorridors();
      const target = corridors[0];
      const ok = service.severCorridor(target.id);
      assert.strictEqual(ok, true);
      assert.strictEqual(service.getAllCorridors().length, corridors.length - 1);
    });

    it('executes universal corridor purge', () => {
      const initial = service.getAllCorridors().length;
      const count = service.deleteAllCorridors();
      assert.strictEqual(count, initial);
      assert.strictEqual(service.getAllCorridors().length, 0);
    });
  });

  describe('Batch Ingestion (CSV & JSON)', () => {
    it('parses statute CSV and bulk creates mappings', () => {
      const csv = `bns,ipc,title,bail,cognizable,punish,court
BNS 64,IPC 376,Rape,Non-Bailable,true,Rigorous Imprisonment not less than 10 years,Court of Session
BNS 303(2),IPC 379,Theft,Bailable,true,Imprisonment up to 3 years,Any Magistrate`;

      const parsed = service.parseStatuteCSV(csv);
      assert.strictEqual(parsed.length, 2);
      assert.strictEqual(parsed[0].bnsSection, 'BNS 64');
      assert.strictEqual(parsed[0].ipcSection, 'IPC 376');

      const created = service.bulkCreateStatutes(parsed);
      assert.strictEqual(created.length, 2);
      assert.ok(service.getStatuteByBns('64'));
    });

    it('parses corridor CSV and bulk provisions corridors', () => {
      const csv = `source,target,jurisdiction,precedent,adherence,protocol
BNS 64,Court of Session,Sessions Court,Nirbhaya Ratio (2017) 6 SCC 1,100.0,Sec 183 BNSS
BNS 303,Lok Adalat,Magistrate,Compounding under BNSS 359,98.0,Pre-Litigation Settlement`;

      const parsed = service.parseCorridorCSV(csv);
      assert.strictEqual(parsed.length, 2);
      assert.strictEqual(parsed[0].sourceStatute, 'BNS 64');

      const created = service.bulkCreateCorridors(parsed);
      assert.strictEqual(created.length, 2);
    });
  });
});
