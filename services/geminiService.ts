import { GoogleGenAI, Type } from "@google/genai";
import { Faction, Player, Enemy } from '../types';

// Initialize Gemini
// NOTE: In a real production app, ensure API keys are secured. 
// Here we follow the instruction to use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';

/**
 * Generates a random narrative event for the player.
 */
export const generateEventNarrative = async (player: Player, action: string): Promise<string> => {
  try {
    const prompt = `
      You are the narrator of a "Romance of the Three Kingdoms" RPG.
      The player is ${player.name}, a level ${player.level} general of ${player.faction}.
      Current Status: Troops: ${player.troops}, Gold: ${player.gold}.
      
      The player has chosen to: ${action}.
      
      Generate a short, immersive paragraph (2-3 sentences) in Chinese describing what happens. 
      Use archaic but readable Chinese style (半文半白).
      Make it flavorful but keep it concise.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "事件发生，但迷雾遮蔽了视线...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `你执行了${action}，虽有波折，但无大碍。`;
  }
};

/**
 * Generates an enemy for battle.
 */
export const generateEnemy = async (playerLevel: number): Promise<Enemy> => {
  try {
    const prompt = `
      Generate a random enemy for a Three Kingdoms RPG battle.
      Player Level: ${playerLevel}.
      Return JSON only with these fields:
      - name (string): Name of the enemy general or unit (e.g. "黄巾贼首", "吕布亲兵", "华雄").
      - title (string): A cool title (e.g. "西凉猛虎", "无名小卒").
      - strength (number): Between ${10 + playerLevel * 2} and ${20 + playerLevel * 3}.
      - maxHp (number): Between ${50 + playerLevel * 10} and ${100 + playerLevel * 20}.
      - difficulty (string): 'Easy', 'Medium', 'Hard', or 'Boss'.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            strength: { type: Type.NUMBER },
            maxHp: { type: Type.NUMBER },
            difficulty: { type: Type.STRING }
          }
        }
      }
    });
    
    // Parse the JSON. The SDK helper might return raw text in .text, which is a JSON string.
    const enemyData = JSON.parse(response.text);
    return {
      ...enemyData,
      hp: enemyData.maxHp // Initialize current HP to Max HP
    };

  } catch (error) {
    console.error("Error generating enemy:", error);
    // Fallback enemy
    return {
      name: "流寇",
      title: "出没山林的强盗",
      strength: 10 + playerLevel * 2,
      maxHp: 80 + playerLevel * 10,
      hp: 80 + playerLevel * 10,
      difficulty: 'Easy'
    };
  }
};

/**
 * Generates battle commentary.
 */
export const generateBattleCommentary = async (
  attackerName: string, 
  defenderName: string, 
  damage: number, 
  isCrit: boolean,
  isPlayerAttacking: boolean
): Promise<string> => {
  try {
    const prompt = `
      Write a ONE sentence action description for a Three Kingdoms battle.
      Attacker: ${attackerName}.
      Defender: ${defenderName}.
      Damage dealt: ${damage}.
      Critical Hit: ${isCrit}.
      Language: Chinese (Action oriented style).
      Example: "${attackerName}大喝一声，手中兵器如猛虎下山，重创${defenderName}！"
    `;
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (e) {
    return `${attackerName} 攻击了 ${defenderName}，造成了 ${damage} 点伤害。`;
  }
};