import wallet from "../cluster1/wallet/dev-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("8xRpbEr3BnWpDaTFg44HCWr28WTYwrDEHdMhgv9tTpos")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = { mint, mintAuthority: signer }

        let data: DataV2Args = {
            name: "Turbin3",
            symbol: "TUR",
            uri: "https://www.arweave.com/nft",
            sellerFeeBasisPoints: 1,
            creators: null,
            collection: null,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
        //result - 38jLTDCdLNJF8WSCezVdkJ429z343VbAMUAuFruvD96faCh4CkihMCcHQoJhiPVRHkgDf4vaet8RsDnqWsGsVrrp
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
