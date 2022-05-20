import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import RegisterETHSend from "../components/RegisterETHSend";
import useEagerConnect from "../hooks/useEagerConnect";

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Head>
        <title>Future Transaction Bot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Link href="/">
            <a>FutureTx</a>
          </Link>
          <div className="account-info">
            <ETHBalance />
            <Account triedToEagerConnect={triedToEagerConnect} />
          </div>
        </nav>
      </header>

      <main>
        <h1>
          Create Future Transaction
        </h1>
        {isConnected && (
          <section>
            <RegisterETHSend/>
          </section>
        )}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
