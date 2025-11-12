// === Projet Blackjack complet avec détection de Blackjack ===
// === nom-prenom-projet-blackjack.ts ===

// --- Fonctions de décision principales ---

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

// --- Gestion des cartes ---

const cartesTab: (string | number)[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

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

// --- Détection du blackjack ---

function estBlackjack(hand: (string | number)[]): boolean {
  return hand.length === 2 && calculateTotal(hand) === 21;
}

// --- Fonction pour jouer une main ---

function jouerMain(hand: (string | number)[], dealerCard: string | number, isSplitAce: boolean = false): number {
  let decision: string;
  do {
    decision = getBlackjackDecision(hand, dealerCard);
    if (decision === "Tirer") {
      const newCard = returnRandomCard();
      hand.push(newCard);
    }
    if (calculateTotal(hand) > 21) break;
    if (isSplitAce) break; // Split As : une seule carte
  } while (decision === "Tirer");
  return calculateTotal(hand);
}

// --- Simulation d'une partie complète ---

function jouerPartie(): {
  resultat: "Victoire" | "Défaite" | "Nulle";
  joueur: (string | number)[];
  croupier: (string | number)[];
  blackjackJoueur: boolean;
  blackjackCroupier: boolean;
} {
  let playerHand: (string | number)[] = [returnRandomCard(), returnRandomCard()];
  let dealerHand: (string | number)[] = [returnRandomCard(), returnRandomCard()];

  const blackjackJoueur = estBlackjack(playerHand);
  const blackjackCroupier = estBlackjack(dealerHand);

  // Si blackjack direct
  if (blackjackJoueur && blackjackCroupier) {
    return { resultat: "Nulle", joueur: playerHand, croupier: dealerHand, blackjackJoueur, blackjackCroupier };
  } else if (blackjackJoueur) {
    return { resultat: "Victoire", joueur: playerHand, croupier: dealerHand, blackjackJoueur, blackjackCroupier };
  } else if (blackjackCroupier) {
    return { resultat: "Défaite", joueur: playerHand, croupier: dealerHand, blackjackJoueur, blackjackCroupier };
  }

  // Sinon on joue normalement
  const totalJoueur = jouerMain(playerHand, dealerHand[0]);
  while (calculateTotal(dealerHand) < 17) dealerHand.push(returnRandomCard());

  const totalCroupier = calculateTotal(dealerHand);
  let resultat: "Victoire" | "Défaite" | "Nulle";
  if (totalJoueur > 21) resultat = "Défaite";
  else if (totalCroupier > 21) resultat = "Victoire";
  else if (totalJoueur > totalCroupier) resultat = "Victoire";
  else if (totalJoueur < totalCroupier) resultat = "Défaite";
  else resultat = "Nulle";

  return { resultat, joueur: playerHand, croupier: dealerHand, blackjackJoueur, blackjackCroupier };
}

// --- Simulation du Blackjack avec choix du mode de mise ---

import * as readlineSync from "readline-sync";

function simulationBlackjack() {
  console.log("=== Simulation Blackjack ===\n");
  console.log("Choisissez le mode de mise :");
  console.log("1 - Mise constante");
  console.log("2 - Mise progressive");
  let choix: string = readlineSync.question("Entrez votre choix (1 ou 2) : ");

  if (choix === "1") {
    // --- Mise constante ---
    const soldeInitial = 500;
    const miseConstante = 10;
    let solde = soldeInitial;
    const NbPartiesSimule = 100;

    for (let i = 1; i <= NbPartiesSimule; i++) {

      if (solde < miseConstante) {
        console.log("💸 Plus assez d’argent pour continuer.");
        break;
      }

      const { resultat, joueur, croupier, blackjackJoueur, blackjackCroupier } = jouerPartie();

      // Gestion du solde
      if (resultat === "Victoire") solde += miseConstante;
      else if (resultat === "Défaite") solde -= miseConstante;
      // Nulle : solde inchangé

      // Affichage détaillé
      console.log(`🎲 Partie ${i}`);
      console.log(`  🧑 Joueur : [${joueur.join(", ")}] ${blackjackJoueur ? "(Blackjack !)" : ""}`);
      console.log(`  🏦 Croupier : [${croupier.join(", ")}] ${blackjackCroupier ? "(Blackjack !)" : ""}`);
      console.log(`  ➤ Résultat : ${resultat}`);
      console.log(`  💰 Mise : ${miseConstante} | Solde actuel : ${solde}\n`);
    }

    console.log("\n--- Résumé final ---");
    console.log(`💵 Solde final : ${solde}`);
  } else if (choix === "2") {
    // --- Mise progressive ---
    let solde = 100;
    const miseInitiale = 10;
    let mise = miseInitiale;
    let niveau = 1;
    let sequencesReussies = 0;
    const NbPartiesSimule = 100;

    console.log("\n=== Début de la simulation Blackjack (mise progressive) ===\n");

    for (let i = 1; i <= NbPartiesSimule; i++) {
      if (solde < mise) {
        console.log("💸 Plus assez d’argent pour continuer.");
        break;
      }

      const { resultat, joueur, croupier, blackjackJoueur, blackjackCroupier } = jouerPartie();

      if (resultat === "Victoire") {
        solde += mise * 2;
        if (niveau === 1) {
          niveau = 2;
          mise = miseInitiale * 2;
        } else if (niveau === 2) {
          niveau = 3;
          mise = miseInitiale * 3;
          sequencesReussies++;

        }
      } else if (resultat === "Nulle") {
        // mise inchangée
      } else {
        solde -= mise;
        niveau = 1;
        mise = miseInitiale;
      }

      console.log(`🎲 Partie ${i}`);
      console.log(`  🧑 Joueur : [${joueur.join(", ")}] ${blackjackJoueur ? "(Blackjack !)" : ""}`);
      console.log(`  🏦 Croupier : [${croupier.join(", ")}] ${blackjackCroupier ? "(Blackjack !)" : ""}`);
      console.log(`  ➤ Résultat : ${resultat}`);
      console.log(`  💰 Mise : ${mise} | Solde actuel : ${solde}\n`);
    }

    console.log("\n--- Résumé final ---");
    console.log(`💵 Solde final : ${solde}`);
    console.log(`🏆 Séquences réussies (3x la mise atteinte) : ${sequencesReussies}`);
  } else {
    console.log("❌ Choix invalide");
  }
}

simulationBlackjack();
