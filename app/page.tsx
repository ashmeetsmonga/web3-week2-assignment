"use client";

import { HDNodeWallet } from "ethers";
import * as bip from "bip39";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Clipboard, RefreshCw } from "lucide-react";
import CompactToolTip from "@/components/CompactToolTip";
import toast from "react-hot-toast";

interface Wallet {
  key: string;
  path: string;
}

export default function Home() {
  const [mnemonic, setMnemonic] = useState("");
  const [walletCount, setWalletCount] = useState(1);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const generateMnemonic = () => {
    const newMnemonic = bip.generateMnemonic();
    setMnemonic(newMnemonic);
  };

  const generateWallets = () => {
    const seed = bip.mnemonicToSeedSync(mnemonic);
    const node = HDNodeWallet.fromSeed(seed);
    const newWallets: Wallet[] = [];

    for (let i = 0; i < walletCount; i++) {
      const path = `m/44'/60'/${i}'/0'`;
      const wallet = node.derivePath(path);
      newWallets.push({ key: wallet.publicKey, path: path });
    }

    setWallets(newWallets);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${type} copied to clipboard!`))
      .catch(() => toast.error(`Failed to copy ${type.toLowerCase()}`));
  };

  return (
    <div className="w-screen p-10 flex flex-col items-center">
      <Card className="mt-10 w-full md:max-w-[750px]">
        <CardHeader>
          <CardTitle className="text-4xl">Etherium Wallet Manager</CardTitle>
          <CardDescription>Generate or manage your etherium wallets</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div>
            <p className="text-sm font-semibold mb-1">Mnemonic Phrase</p>
            <div className="flex gap-2">
              <Input type="text" value={mnemonic} onChange={(e) => setMnemonic(e.target.value)} placeholder="Enter mnemonic or generate a new one" />
              <CompactToolTip
                title="New Mnemonic"
                component={
                  <Button variant="outline" onClick={generateMnemonic}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                }
              />
              <CompactToolTip
                title="Copy"
                component={
                  <Button variant="outline">
                    <Clipboard className="h-4 w-4" onClick={() => copyToClipboard(mnemonic, "Mnemonic")} />
                  </Button>
                }
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Number Of Wallets : {walletCount}</p>
            <Slider defaultValue={[walletCount]} onValueChange={(value) => setWalletCount(value[0])} max={10} step={1} min={1} />
          </div>

          <Button className="w-fit self-end" onClick={generateWallets}>
            Generate Wallets
          </Button>
        </CardContent>
        {wallets.length > 0 && (
          <CardFooter className="flex flex-col items-start w-full">
            <p className="text-2xl font-semibold">Wallets</p>
            <div className="mt-3 w-full">
              {wallets.map((wallet) => (
                <div key={wallet.path} className="w-full mb-2 bg-slate-100 rounded p-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className=" md:w-4/5">
                    <p className="font-mono text-sm font-semibold text-wrap text-ellipsis overflow-clip">{wallet.key}</p>
                    <p className="font-thin text-xs">path: {wallet.path}</p>
                  </div>
                  <CompactToolTip
                    component={
                      <Button variant="outline" className="w-fit self-end" onClick={() => copyToClipboard(wallet.key, "Key")}>
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    }
                    title="Copy"
                  />
                </div>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
