const hexToBinary = require('hex-to-binary');
const Block = require('./block');
const {GENESIS_DATA, MINE_RATE} = require("../config");
const { cryptoHash } = require('../util');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-lastHash';
    const hash = 'foo-hash';
    const data = ['foo-data1', 'foo-data2'];
    const nonce = 1;
    const difficulty = 3;
    const block = new Block({timestamp, lastHash, hash, data, nonce, difficulty});

    it('has a timestamp, lastHash, hash, data, nonce and difficulty', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        
        it('returns the block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });
        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({ lastBlock, data} );

        it('returns the block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });
        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it('sets the data', () => {
            expect(minedBlock.data).toEqual(data);
        });
        it('has the timestamp', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });
        it('creates the same SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data, minedBlock.nonce, minedBlock.difficulty));
        });
        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });
        it('adjusts the difficulty', () => {
            const possibleDifficulty = [lastBlock.difficulty - 1, lastBlock.difficulty + 1]
            expect(possibleDifficulty.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty if the block is mined quickly', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });
        it('lowers the difficulty if the block is mined slowly', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1);
        });
        it('has a lower limit of 1', () => {
            block.difficulty = -1
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1);
        });
    });
});