import { Dev3SDK  } from "dev3-sdk";

let dev3SdksMap: Map<number, Dev3SDK> = new Map<number, Dev3SDK>();

export function dev3Sdks(): Map<number, Dev3SDK> {
    if (dev3SdksMap.size === 0) {
        const { public: publicKey } = useRuntimeConfig();
        dev3SdksMap.set(1, new Dev3SDK(
            publicKey.ethereumApiKey,
            "e51b050c-5402-4649-8212-ebc26d6bd508"
        ));
        dev3SdksMap.set(137, new Dev3SDK(
            publicKey.polygonApiKey,
            "a5343d40-06ae-4836-a106-966d4a9d92af"
          ));
        dev3SdksMap.set(56, new Dev3SDK(
            publicKey.bscApiKey,
            "e76e0bcd-9749-4601-82f2-a2c1925112a1"
          ));
        dev3SdksMap.set(100, new Dev3SDK(
            publicKey.gnosisApiKey,
            "75dddfcc-d90a-46fd-b560-998c330035e4"
          ));
        dev3SdksMap.set(250, new Dev3SDK(
            publicKey.fantomApiKey,
            "c280bfee-d0f7-4c63-bcec-6423cc23f8d8"
          ));
        dev3SdksMap.set(1285, new Dev3SDK(
            publicKey.mooonriverApiKey,
            "82a4435f-bbd9-4330-a8d7-f8afe0165561"
          ));
        dev3SdksMap.set(43114, new Dev3SDK(
            publicKey.avaxApiKey,
            "59701816-cae7-4d32-9339-317b21b800b5"
          ));
        dev3SdksMap.set(1313161554, new Dev3SDK(
            publicKey.auroraApiKey,
            "b59f4e8b-bd67-42b1-a667-b1ad4e6e2b98"
          ));
    }
    return dev3SdksMap;
}
