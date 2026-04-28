import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useWallet } from "../context/WalletContext";

const playSound = (type: 'correct'|'wrong') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (type === 'correct') {
      const playNote = (freq, time, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.start(time); osc.stop(time + dur);
      };
      const t = ctx.currentTime;
      playNote(440, t, 0.1);
      playNote(554.37, t + 0.1, 0.1);
      playNote(659.25, t + 0.2, 0.2);
      playNote(880, t + 0.3, 0.4);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    }
  } catch {
    return;
  }
};
const LESSONS = [
  {
    id: "blockchain-101",
    level: "Beginner",
    icon: "⛓️",
    title: "What is a Blockchain?",
    duration: "3 min read",
    tag: "blockchain",
    content: [
      { type: "intro", text: "Imagine a **notebook** that thousands of people share. Whenever someone writes something in it, everyone else can see it — and no one can erase it. That's basically a blockchain!" },
      { type: "heading", text: "The simple explanation 🧒" },
      { type: "text", text: "A blockchain is a list of records (called **blocks**) that are chained together. Each block contains:\n- Some data (like \"Alice sent 1 Bitcoin to Bob\")\n- A special code that links it to the previous block\n- A timestamp (when it was created)" },
      { type: "callout", icon: "💡", text: "Because each block is linked to the one before it, you'd need to change **all** previous blocks to tamper with the data. This makes it almost impossible to cheat!" },
      { type: "heading", text: "Who is in charge? 🤔" },
      { type: "text", text: "Nobody — and that's the point! Instead of one bank or company controlling the records, **thousands of computers** around the world all hold a copy. This is called being **decentralized**." },
      { type: "example", title: "Real World Example", text: "Bitcoin uses a blockchain to record every payment ever made. No bank controls it. No government can freeze it. The rules are written in code." },
      { 
        type: "quiz", 
        question: "What makes it hard to change data in a blockchain?", 
        options: ["A password", "Blocks are linked with codes — changing one breaks the whole chain", "The government protects it", "It's stored in a vault"], 
        correct: 1,
        backups: [
          { question: "Who controls a decentralized blockchain?", options: ["The CEO", "A bank", "Thousands of computers around the world", "The government"], correct: 2 },
          { question: "What is a block in a blockchain?", options: ["A physical cube of data", "A record of data linked to the previous one", "A password manager", "A server room"], correct: 1 },
          { question: "Why is a blockchain decentralized?", options: ["Because one server hosts it", "Because it is shared among thousands of computers", "Because there is no code", "Because it is offline"], correct: 1 }
        ]
      }
    ]
  },
  {
    id: "smart-contracts",
    level: "Beginner",
    icon: "📜",
    title: "What is a Smart Contract?",
    duration: "4 min read",
    tag: "blockchain",
    content: [
      { type: "intro", text: "A smart contract is a **computer program that runs automatically** when certain conditions are met — like a vending machine that gives you a snack when you put in money." },
      { type: "heading", text: "Why is it called 'smart'? 🤓" },
      { type: "text", text: "Because it executes on its own, without needing a middleman like a lawyer or a bank. The rules are written in code, deployed on the blockchain, and run automatically." },
      { type: "callout", icon: "⚙️", text: "Smart contracts are used for everything: paying artists when their NFT is sold, automatically distributing profits, running decentralized exchanges like Uniswap." },
      { type: "heading", text: "Why do they matter for security?" },
      { type: "text", text: "Once a smart contract is deployed, it's very hard to change. If there's a **bug or a backdoor** in the code, hackers can exploit it and drain all the funds. This is exactly what Urban Umbrella scans for." },
      { type: "example", title: "Famous Example — The DAO Hack (2016)", text: "A smart contract called 'The DAO' had a bug that let an attacker repeatedly withdraw funds before the balance updated. They stole $60 million worth of Ethereum in just a few hours." },
      { 
        type: "quiz", 
        question: "What happens if a smart contract has a bug?", 
        options: ["It automatically fixes itself", "Nothing, it's perfect code", "Hackers can exploit it — and funds can be stolen", "The bank refunds you"], 
        correct: 2,
        backups: [
          { question: "Who runs a smart contract?", options: ["A bank teller", "A lawyer", "It runs automatically on the blockchain", "A judge"], correct: 2 },
          { question: "Can you easily change a smart contract after deployment?", options: ["Yes, anytime", "No, it's very hard or impossible to change", "Only on Tuesdays", "Yes, by calling support"], correct: 1 },
          { question: "What is the primary benefit of a smart contract?", options: ["It requires human approval", "It runs automatically without middlemen", "It can be easily deleted", "It stores physical items"], correct: 1 }
        ]
      }
    ]
  },
  {
    id: "crypto-wallets",
    level: "Beginner",
    icon: "👛",
    title: "Crypto Wallets Explained",
    duration: "3 min read",
    tag: "security",
    content: [
      { type: "intro", text: "A crypto wallet doesn't actually store your coins — it stores the **secret key** that proves you own them. Like owning a key to a safety deposit box." },
      { type: "heading", text: "Two kinds of keys 🔑" },
      { type: "text", text: "**Public Key** = Your account number. Share it freely — people need it to send you crypto.\n\n**Private Key / Seed Phrase** = Your password. NEVER share this with anyone. Not even support staff. Not even us." },
      { type: "callout", icon: "🚨", text: "The #1 way people lose crypto: someone tricks them into revealing their seed phrase. Real apps and support teams will NEVER ask for it." },
      { type: "heading", text: "Hot vs Cold wallets" },
      { type: "text", text: "**Hot wallets** (like MetaMask) are connected to the internet — convenient but more vulnerable. **Cold wallets** (like Ledger) are physical devices kept offline — much safer for large amounts." },
      { 
        type: "quiz", 
        question: "What should you NEVER share with anyone?", 
        options: ["Your wallet address", "Your transaction history", "Your seed phrase / private key", "Your MetaMask username"], 
        correct: 2,
        backups: [
          { question: "What does a crypto wallet actually store?", options: ["Digital coins", "Your secret keys", "Physical money", "Your ID"], correct: 1 },
          { question: "Which is safer for storing large amounts of crypto?", options: ["A hot wallet (like MetaMask)", "A cold wallet (offline device)", "An exchange account", "A screenshot"], correct: 1 },
          { question: "What is your Public Key used for?", options: ["To log into websites", "To let people send you crypto", "To recover your wallet", "To encrypt your password"], correct: 1 }
        ]
      }
    ]
  },
  {
    id: "defi-dapps",
    level: "Intermediate",
    icon: "🏦",
    title: "DeFi & DApps — What Are They?",
    duration: "5 min read",
    tag: "defi",
    content: [
      { type: "intro", text: "**DeFi** stands for Decentralized Finance. It's like a bank — but there are no humans running it, no opening hours, and no one can freeze your account." },
      { type: "heading", text: "What can you do in DeFi?" },
      { type: "text", text: "- **Swap** one token for another (like Uniswap)\n- **Lend** your crypto and earn interest (like Aave)\n- **Borrow** against your crypto without a credit check\n- **Provide liquidity** and earn trading fees" },
      { type: "callout", icon: "⚠️", text: "DeFi comes with real risks: smart contract bugs, rug pulls, or approving the wrong transaction. Always verify the site URL and audit the contract before depositing funds." },
      { type: "heading", text: "What is a DApp?" },
      { type: "text", text: "A **DApp** (Decentralized Application) runs its logic on the blockchain instead of a company's server. They use smart contracts as their backend. When you use Uniswap to swap tokens, you're directly interacting with a smart contract — no company in between." },
      { type: "example", title: "Common DApps", text: "Uniswap (exchange), OpenSea (NFT marketplace), Aave (lending), MakerDAO (stablecoins), Compound (savings)." },
      { 
        type: "quiz", 
        question: "What makes DeFi 'decentralized'?", 
        options: ["It's run by a big company", "No single entity controls it — it runs on smart contracts", "It's only available in certain countries", "You need ID to use it"], 
        correct: 1,
        backups: [
          { question: "What is a DApp?", options: ["A decentralized application running on smart contracts", "A new iPhone model", "A bank account", "A password manager"], correct: 0 },
          { question: "What is a common risk in DeFi?", options: ["Getting a low credit score", "Smart contract bugs and rug pulls", "Banks closing on Sundays", "Losing your debit card"], correct: 1 },
          { question: "How do you interact with a DApp?", options: ["Through a traditional bank", "Directly through a smart contract using your wallet", "By calling customer service", "By creating a username and password"], correct: 1 }
        ]
      }
    ]
  },
  {
    id: "rug-pulls-phishing",
    level: "Intermediate",
    icon: "🚨",
    title: "Rug Pulls & Phishing Attacks",
    duration: "4 min read",
    tag: "security",
    content: [
      { type: "intro", text: "The two biggest scams in crypto. Understanding them is your first line of defence — and it's simpler than you think." },
      { type: "heading", text: "🪤 What is a Rug Pull?" },
      { type: "text", text: "Developers create a new token, hype it up on social media, get people to invest — then suddenly withdraw all the liquidity and disappear, leaving investors with worthless tokens." },
      { type: "callout", icon: "🚩", text: "Red flags: Anonymous team, code not audited, liquidity not locked, promises of unrealistic returns (1000% gains!)." },
      { type: "heading", text: "🎣 What is Phishing?" },
      { type: "text", text: "Scammers create fake websites that look exactly like real DApps (Uniswap, OpenSea, MetaMask). They trick you into connecting your wallet or entering your seed phrase — then they drain everything." },
      { type: "example", title: "Common Phishing Tricks", text: "• Fake Discord 'support' DMs asking you to 'verify' your wallet\n• Google ads showing fake Uniswap (unlswap.com)\n• Airdrop sites that require you to 'sync' your wallet" },
      { 
        type: "quiz", 
        question: "Which is a major red flag for a rug pull?", 
        options: ["The team is publicly known", "The code has been audited", "They promise 1000x returns and the team is anonymous", "The project has been running for 2 years"], 
        correct: 2,
        backups: [
          { question: "What is a phishing attack?", options: ["Stealing physical wallets", "Fake websites tricking you into giving up your seed phrase", "A type of blockchain", "A secure way to store crypto"], correct: 1 },
          { question: "Will real support staff ever ask for your seed phrase?", options: ["Yes, to verify your identity", "Only via Discord DMs", "Never", "Yes, if you forgot your password"], correct: 2 },
          { question: "What do rug pull scammers usually do?", options: ["Refund all users", "Wait for the token to grow", "Withdraw all liquidity and disappear", "Build better features"], correct: 2 }
        ]
      }
    ]
  },
  {
    id: "token-approvals",
    level: "Advanced",
    icon: "🛡️",
    title: "Token Approvals — The Hidden Risk",
    duration: "5 min read",
    tag: "security",
    content: [
      { type: "intro", text: "Token approvals are one of the most misunderstood parts of crypto. Many people don't realise they might have already given scammers permission to drain their wallets." },
      { type: "heading", text: "How approvals work" },
      { type: "text", text: "When you use a DApp (like Uniswap to swap tokens), you first need to **approve** that DApp to spend your tokens. This approval can be:\n- **Limited**: only the amount needed\n- **Unlimited**: forever, for as many tokens as they want" },
      { type: "callout", icon: "🚨", text: "Most DApps ask for **unlimited** approval by default. If that DApp gets hacked later, or was a scam all along, they can drain your wallet even if you stopped using the app." },
      { type: "heading", text: "How to stay safe" },
      { type: "text", text: "1. Always check what you're approving in MetaMask before signing\n2. Use tools like **revoke.cash** to see and remove old approvals\n3. Approve only the exact amount you need, not unlimited\n4. Revoke approvals after use" },
      { type: "example", title: "Real Incident — Unlimited Approval Exploit", text: "In 2023, several users lost funds when a DApp they'd approved months earlier was exploited. The attacker used the unlimited approval to drain their wallets — long after the users had stopped using the app." },
      { 
        type: "quiz", 
        question: "What is the safest approach to token approvals?", 
        options: ["Always approve unlimited — it's easier", "Approve only what you need and revoke after use", "Never use DApps at all", "Approvals expire automatically, so it's fine"], 
        correct: 1,
        backups: [
          { question: "Why are unlimited approvals dangerous?", options: ["They cost more gas", "If the DApp is hacked, attackers can drain your wallet", "They expire too quickly", "They make transactions slower"], correct: 1 },
          { question: "How can you check your existing approvals?", options: ["Ask your bank", "Use tools like revoke.cash", "Delete your wallet", "You cannot check them"], correct: 1 },
          { question: "Do token approvals expire automatically?", options: ["Yes, after 1 week", "No, they remain until you revoke them", "Yes, when you close the browser", "Yes, after 24 hours"], correct: 1 }
        ]
      }
    ]
  }
];

const LEVEL_COLORS = { Beginner: "#22c55e", Intermediate: "#f59e0b", Advanced: "#ef4444" };
const TAG_LABELS = { blockchain: "⛓️ Blockchain", security: "🔒 Security", defi: "🏦 DeFi" };

function LessonContent({ content }) {
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const handleQuizClick = (oi, currentQuiz) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(oi);
    if (oi === currentQuiz.correct) {
      playSound('correct');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#22c55e', '#ffffff'] });
    } else {
      playSound('wrong');
    }
  };

  const handleRetry = () => {
    setQuizAnswer(null);
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="lesson-content">
      {content.map((block, i) => {
        switch (block.type) {
          case "intro":
            return <p key={i} className="lesson-intro" dangerouslySetInnerHTML={{ __html: block.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
          case "heading":
            return <h3 key={i} className="lesson-heading">{block.text}</h3>;
          case "text":
            return (
              <div key={i} className="lesson-text" dangerouslySetInnerHTML={{
                __html: block.text
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br/>")
              }} />
            );
          case "callout":
            return (
              <div key={i} className="lesson-callout">
                <span>{block.icon}</span>
                <p dangerouslySetInnerHTML={{ __html: block.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
              </div>
            );
          case "example":
            return (
              <div key={i} className="lesson-example">
                <strong>📌 {block.title}</strong>
                <p dangerouslySetInnerHTML={{ __html: block.text.replace(/\n/g, "<br/>") }} />
              </div>
            );
          case "quiz": {
            // Determine which quiz to show based on retry count
            let currentQuiz = block;
            if (retryCount > 0 && block.backups && block.backups.length > 0) {
              const backupIdx = (retryCount - 1) % block.backups.length;
              currentQuiz = block.backups[backupIdx];
            }
            
            return (
              <div key={i} className="lesson-quiz">
                <h4>🧠 Quick Check: {currentQuiz.question}</h4>
                <div className="quiz-options">
                  {currentQuiz.options.map((opt, oi) => (
                    <button
                      key={oi}
                      className={`quiz-option ${quizAnswer !== null ? (oi === currentQuiz.correct ? "correct pulse-green" : quizAnswer === oi ? "wrong shake" : "dim") : ""}`}
                      onClick={() => handleQuizClick(oi, currentQuiz)}
                      disabled={quizAnswer !== null}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {quizAnswer !== null && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p className={`quiz-result ${quizAnswer === currentQuiz.correct ? "right" : "wrong"}`}>
                      {quizAnswer === currentQuiz.correct ? "🎉 Correct! Great job!" : "Not quite!"}
                    </p>
                    {quizAnswer !== currentQuiz.correct && (
                      <button className="uu-btn uu-btn-ghost" style={{ alignSelf: 'flex-start', color: '#fca5a5', borderColor: '#fca5a5' }} onClick={handleRetry}>
                        🔄 Wanna retry?
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          }
          default: return null;
        }
      })}
    </div>
  );
}

export default function Learn() {
  const { address } = useWallet();
  const [filter,   setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("uu_completed") || "[]"); }
    catch { return []; }
  });
  
  const [showCertificate, setShowCertificate] = useState(false);
  const [certName, setCertName] = useState("");

  useEffect(() => {
    if (address && !certName) {
      setCertName(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address, certName]);

  const markComplete = (id) => {
    const next = completed.includes(id) ? completed : [...completed, id];
    setCompleted(next);
    localStorage.setItem("uu_completed", JSON.stringify(next));
    
    // Confetti celebration!
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    
    // Wait a second before closing so they see the button turn green
    setTimeout(() => setSelected(null), 1500);
  };

  const tags = ["all", "blockchain", "security", "defi"];
  const filtered = filter === "all" ? LESSONS : LESSONS.filter(l => l.tag === filter);
  const lesson = LESSONS.find(l => l.id === selected);

  return (
    <div className="page-learn">
      <div className="page-header">
        <h1 className="page-title">🎓 Security Academy</h1>
        <p className="page-subtitle">
          Learn how blockchain works, what makes DApps dangerous, and how to protect yourself —
          in bite-size lessons built for <strong>everyone</strong>.
          <br/>Progress: <strong>{completed.length}/{LESSONS.length}</strong> lessons completed 🚀
        </p>
      </div>

      {lesson ? (
        /* ── LESSON VIEW ── */
        <div className="lesson-view">
          <button className="uu-btn uu-btn-ghost" onClick={() => setSelected(null)} style={{ marginBottom: 24 }}>
            ← Back to Lessons
          </button>
          <div className="uu-card lesson-card-open">
            <div className="lesson-card-header">
              <div className="lesson-big-icon">{lesson.icon}</div>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <span className="level-badge" style={{ background: LEVEL_COLORS[lesson.level] }}>{lesson.level}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>{lesson.duration}</span>
                </div>
                <h2>{lesson.title}</h2>
              </div>
            </div>
            <LessonContent content={lesson.content} />
            <div style={{ marginTop: 32, textAlign: "center" }}>
              {!completed.includes(lesson.id) ? (
                <button className="uu-btn uu-btn-primary" onClick={() => markComplete(lesson.id)}>
                  ✅ Mark as Complete
                </button>
              ) : (
                <div style={{ color: "#22c55e", fontWeight: 600 }}>✅ Lesson complete! Great work.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── LESSON LIST ── */
        <>
          {/* Progress bar */}
          <div className="uu-card progress-card" data-tour="learn-progress" style={completed.length === LESSONS.length ? { borderColor: 'rgba(234, 179, 8, 0.5)', boxShadow: '0 0 30px rgba(234, 179, 8, 0.15)' } : {}}>
            <div className="progress-header">
              <span>{completed.length === LESSONS.length ? "🏆 Master Status Achieved!" : "📈 Your Progress"}</span>
              <span>{completed.length} / {LESSONS.length} lessons</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(completed.length / LESSONS.length) * 100}%`, background: completed.length === LESSONS.length ? 'linear-gradient(90deg, #f59e0b, #facc15)' : 'var(--gradient)' }} />
            </div>
          </div>
          
          {/* Certificate Claim */}
          {completed.length === LESSONS.length && (
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {!showCertificate ? (
                <button className="uu-btn uu-btn-primary" style={{ background: "linear-gradient(135deg, #f59e0b, #facc15)", color: "#000", fontSize: "1.1rem" }} onClick={() => { setShowCertificate(true); confetti({ particleCount: 300, spread: 160 }); }}>
                  🎓 View Your Master Certificate
                </button>
              ) : (
                <div className="certificate-card">
                  <div className="cert-border"></div>
                  <div className="cert-seal"></div>
                  <div className="cert-header">Urban Umbrella Security Academy</div>
                  <div className="cert-title">Certificate of Completion</div>
                  <div className="cert-body">This is to certify that</div>
                  <input 
                    type="text" 
                    className="cert-name-input" 
                    value={certName} 
                    onChange={e => setCertName(e.target.value)} 
                    placeholder="Enter your name" 
                  />
                  <div className="cert-reason">has successfully completed the Web3 Security Academy and demonstrated an advanced understanding of blockchain mechanics, smart contract risks, and DeFi safety.</div>
                  <div className="cert-footer">
                    <div className="cert-signature-block">
                      <div className="cert-signature-line" style={{fontSize: "1.2rem", fontStyle: "normal", fontFamily: "'Inter', sans-serif"}}>
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="cert-signature-label">Date of Completion</div>
                    </div>
                    <div className="cert-signature-block">
                      <div className="cert-signature-line" style={{fontFamily: "'Brush Script MT', cursive, 'Georgia', serif", fontSize: "2.5rem", borderBottom: "none"}}>
                        Urban Umbrella
                      </div>
                      <div className="cert-signature-label" style={{borderTop: "1px solid #333", paddingTop: "5px"}}>Official Authority</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filters */}
          <div className="lesson-filters">
            {tags.map(t => (
              <button
                key={t}
                className={`filter-btn ${filter === t ? "active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {t === "all" ? "🌍 All" : TAG_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="lessons-grid" data-tour="lessons-grid">
            {filtered.map(l => (
              <button key={l.id} className={`lesson-card uu-card ${completed.includes(l.id) ? "verified" : ""}`} onClick={() => setSelected(l.id)}>
                <div className="lesson-card-top">
                  <span className="lesson-icon">{l.icon}</span>
                  {completed.includes(l.id) && <span className="done-badge gold">🏅 Verified</span>}
                </div>
                <div className="lesson-meta">
                  <span className="level-badge" style={{ background: LEVEL_COLORS[l.level] }}>{l.level}</span>
                  <span className="lesson-duration">{l.duration}</span>
                </div>
                <h3 className="lesson-title">{l.title}</h3>
                <p className="lesson-preview">
                  {l.content.find(c => c.type === "intro")?.text.replace(/\*\*(.*?)\*\*/g, "$1").slice(0, 100)}…
                </p>
                <div className="lesson-read-more">Read lesson →</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
