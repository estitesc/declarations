const { assert } = require("chai");

const DeclTest0 = artifacts.require("./DeclTest0.sol");

require("chai").use(require("chai-as-promised")).should();

contract("DeclTest0", ([deployer, minter]) => {
  let declTest;

  const exampleIndices = [
    [10, 15],
    [20, 25],
    [30, 34],
  ];

  before(async () => {
    declTest = await DeclTest0.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await declTest.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("declarations", async () => {
    let result, publicMintCount;

    before(async () => {
      result = await declTest.mint(
        "https://sonn3t.com/disclaimed_witch.png",
        exampleIndices,
        { from: minter }
      );
      publicMintCount = await declTest.publicMintCount();
    });

    it("mints a declaration", async () => {
      // SUCCESS
      assert.equal(publicMintCount, 1);
      const mintEvent = result.logs[0].args;
      const customEvent = result.logs[1].args;
      assert.equal(
        customEvent.id.toNumber(),
        publicMintCount.toNumber() - 1,
        "id is correct"
      );
      assert.equal(customEvent.minter, minter, "owner is correct");

      const convertedIndices = customEvent.indices.map((indexSet) => [
        indexSet[0].toNumber(),
        indexSet[1].toNumber(),
      ]);

      assert.deepEqual(
        convertedIndices,
        exampleIndices,
        "indicies are correct"
      );

      assert.equal(
        customEvent.tokenURI,
        "https://sonn3t.com/disclaimed_witch.png",
        "token URI is are correct"
      );
    });
  });

  describe("emits", async () => {
    let result;

    before(async () => {
      result = await declTest.justEmit({ from: minter });
    });

    it("emits something", async () => {
      const event = result.logs[0].args;
      assert.equal(event.minter, minter, "owner is correct");
    });
  });
});
