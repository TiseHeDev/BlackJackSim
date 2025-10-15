function getBlackjackDecision(hand: (string | number)[], dealer: string | number): string {
  let dealerValue = 0;
  if (dealer === "J" || dealer === "Q" || dealer === "K") dealerValue = 10;
  else if (dealer === "A") dealerValue = 11;
  else dealerValue = parseInt(dealer as string);

  const hasAce = hand.includes("A");
  const bothSame = hand.length === 2 && hand[0] === hand[1];

  let total = 0;
  for (let c of hand) {
    if (c === "A") total += 11;
    else if (c === "J" || c === "Q" || c === "K") total += 10;
    else total += parseInt(c as string);
  }

  if (total > 21 && hasAce) total -= 10;

  if (hand.length === 2 && total === 21) {
    return "Blackjack !";
  }

  if (bothSame) {
    return pairDecision(hand[0], dealerValue);
  } else if (hasAce && total <= 21 && total <= 20 && total >= 13) {
    return softDecision(total, dealerValue);
  } else {
    return hardDecision(total, dealerValue);
  }
}

function hardDecision(total: number, dealer: number): string {
  if (total >= 17) return "Rester";
  else if (total >= 13 && dealer >= 2 && dealer <= 6) return "Rester";
  else if (total === 12 && dealer >= 4 && dealer <= 6) return "Rester";

  if (total === 11) return dealer <= 9 ? "Doubler" : "Tirer";
  if (total === 10 && dealer <= 9) return "Doubler";
  if (total === 9 && dealer >= 3 && dealer <= 6) return "Doubler";

  return "Tirer";
}

function softDecision(total: number, dealer: number): string {
  if (total >= 19) return "Rester";
  if (total === 18) {
    if (dealer >= 3 && dealer <= 6) return "Doubler";
    if (dealer === 2) return "Doubler";
    if (dealer === 7 || dealer === 8) return "Rester";
    return "Tirer";
  }
  if (total === 17 && dealer >= 3 && dealer <= 6) return "Doubler";
  if ((total === 16 || total === 15) && dealer >= 4 && dealer <= 6) return "Doubler";
  if ((total === 14 || total === 13) && (dealer === 5 || dealer === 6)) return "Doubler";
  return "Tirer";
}

function pairDecision(card: string | number, dealer: number): string {
  if (card === "A") return "Split";
  if (card === 10 || card === "K" || card === "Q" || card === "J") return "Rester";
  if (card == 9) return dealer == 7 || dealer >= 10 ? "Rester" : "Split";
  if (card == 8) return "Split";
  if (card == 7) return dealer <= 7 ? "Split" : "Tirer";
  if (card == 6) return dealer <= 6 ? "Split" : "Tirer";
  if (card == 5) return dealer <= 9 ? "Doubler" : "Tirer";
  if (card == 4) return dealer == 5 || dealer == 6 ? "Split" : "Tirer";
  if (card == 3 || card == 2) return dealer <= 7 ? "Split" : "Tirer";
  return "Tirer";
}

// === Gestion des cartes ===
let cartesTab: (string | number)[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

function returnRandomCard(): string | number {
  return cartesTab[Math.floor(Math.random() * cartesTab.length)];
}

function calculateTotal(hand: (string | number)[]): number {
  let total = 0;
  let hasAce = false;
  for (let c of hand) {
    if (c === "A") {
      total += 11;
      hasAce = true;
    } else if (c === "J" || c === "Q" || c === "K") {
      total += 10;
    } else {
      total += parseInt(c as string);
    }
  }
  if (total > 21 && hasAce) total -= 10;
  return total;
}

// === Simulation de la partie avec Split et conclusion finale ===
let playerHand: (string | number)[] = [returnRandomCard(), returnRandomCard()];
let dealerHand: (string | number)[] = [returnRandomCard()]; // carte visible du croupier

console.log(`Cartes du joueur : ${playerHand.join(", ")}`);
console.log(`Carte visible du croupier : ${dealerHand[0]}`);

// Fonction pour jouer une main
function jouerMain(hand: (string | number)[], dealerCard: string | number, isSplitAce: boolean = false): number {
  let decision: string;

  do {
    decision = getBlackjackDecision(hand, dealerCard);
    console.log(`Décision => ${decision} (Main : ${hand.join(", ")} | Total = ${calculateTotal(hand)})`);

    if (decision === "Tirer") {
      const newCard = returnRandomCard();
      hand.push(newCard);
      console.log(`Nouvelle carte tirée : ${newCard}`);
    }

    if (calculateTotal(hand) > 21) {
      console.log("Le joueur dépasse 21, c'est PERDU !");
      break;
    }

    if (isSplitAce) break; // Split As : une seule carte

  } while (decision === "Tirer");

  return calculateTotal(hand);
}

// --- Gestion du Split ---
let playerTotals: number[] = [];

if (playerHand[0] === playerHand[1]) {
  const card = playerHand[0];
  const decisionSplit = pairDecision(card, dealerHand[0]);
  if (decisionSplit === "Split") {
    console.log("Le joueur fait un Split !");
    if (card === "A") {
      const main1 = [card, returnRandomCard()];
      const main2 = [card, returnRandomCard()];
      console.log("Main 1 :", main1.join(", "));
      playerTotals.push(jouerMain(main1, dealerHand[0], true));
      console.log("Main 2 :", main2.join(", "));
      playerTotals.push(jouerMain(main2, dealerHand[0], true));
    } else {
      const main1 = [card, returnRandomCard()];
      const main2 = [card, returnRandomCard()];
      console.log("Main 1 :", main1.join(", "));
      playerTotals.push(jouerMain(main1, dealerHand[0]));
      console.log("Main 2 :", main2.join(", "));
      playerTotals.push(jouerMain(main2, dealerHand[0]));
    }
  } else {
    playerTotals.push(jouerMain(playerHand, dealerHand[0]));
  }
} else {
  playerTotals.push(jouerMain(playerHand, dealerHand[0]));
}

// --- Tour du croupier ---
dealerHand.push(returnRandomCard()); // carte cachée du croupier
console.log(`Cartes complètes du croupier : ${dealerHand.join(", ")}`);

while (calculateTotal(dealerHand) < 17) {
  const newCard = returnRandomCard();
  dealerHand.push(newCard);
  console.log(`Croupier tire : ${newCard} (Total = ${calculateTotal(dealerHand)})`);
}

const dealerTotal = calculateTotal(dealerHand);
console.log(`\nTotal croupier = ${dealerTotal}`);

// --- Conclusion pour chaque main ---
playerTotals.forEach((total, index) => {
  console.log(`\nMain ${index + 1} : Total joueur = ${total}`);
  if (total > 21) {
    console.log("Résultat : PERDU");
  } else if (dealerTotal > 21) {
    console.log("Résultat : GAGNÉ");
  } else if (total > dealerTotal) {
    console.log("Résultat : GAGNÉ");
  } else if (total < dealerTotal) {
    console.log("Résultat : PERDU");
  } else {
    console.log("Résultat : ÉGALITÉ");
  }
});
