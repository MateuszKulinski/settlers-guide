import { _GENERATE_UNIQUE_ID_ } from "../../assets/consts";
import GuideAttackUnit from "../../model/GuideAttackUnit";
import Wave from "../../model/Wave";

export interface CampState {
    wavesBandits: Wave[];
    wavesUnits: Wave[];
    resultMsg: string;
}

export const _REDUCER_ADD_BANDITS_WAVE_ = "addBanditsWave";
export const _REDUCER_REMOVE_BANDITS_WAVE_ = "removeBanditsWave";
export const _REDUCER_EDIT_BANDITS_ = "editBandits";
export const _REDUCER_REMOVE_BANDITS_ = "removeBandits";
export const _REDUCER_ADD_UNITS_WAVE_ = "addUnitsWave";
export const _REDUCER_REMOVE_UNITS_WAVE_ = "removeUnitsWave";
export const _REDUCER_EDIT_UNITS_ = "editUnits";
export const _REDUCER_REMOVE_UNITS_ = "removeUnits";

type CampAction =
    | { type: typeof _REDUCER_ADD_BANDITS_WAVE_; payload: string }
    | { type: typeof _REDUCER_REMOVE_BANDITS_WAVE_; payload: string }
    | {
          type: typeof _REDUCER_EDIT_BANDITS_;
          payload: { waveId: string; data: GuideAttackUnit };
      }
    | {
          type: typeof _REDUCER_REMOVE_BANDITS_;
          payload: { waveId: string; unitId: string };
      }
    | { type: typeof _REDUCER_ADD_UNITS_WAVE_; payload: string }
    | { type: typeof _REDUCER_REMOVE_UNITS_WAVE_; payload: string }
    | {
          type: typeof _REDUCER_EDIT_UNITS_;
          payload: { waveId: string; data: GuideAttackUnit };
      }
    | {
          type: typeof _REDUCER_REMOVE_UNITS_;
          payload: { waveId: string; unitId: string };
      };

export const CampReducer = (state: CampState, action: CampAction) => {
    const { wavesBandits } = state;
    const { wavesUnits } = state;

    switch (action.type) {
        //general

        //endgeneral
        //units
        case _REDUCER_ADD_UNITS_WAVE_: {
            const newWave: Wave = {
                waveId: action.payload,
                items: [new GuideAttackUnit(_GENERATE_UNIQUE_ID_(), 0, 0)],
                generalId: "0",
            };
            return { ...state, wavesUnits: [...wavesUnits, newWave] };
        }
        case _REDUCER_REMOVE_UNITS_WAVE_: {
            const waveIdToRemove = action.payload;
            const updatedWaves = wavesUnits.filter(
                (wave: Wave) => wave.waveId !== waveIdToRemove
            );
            return { ...state, wavesUnits: updatedWaves };
        }
        case _REDUCER_EDIT_UNITS_: {
            const { waveId, data } = action.payload;
            const updatedWaves = [...wavesUnits];

            const waveIndex = updatedWaves.findIndex(
                (wave: Wave) => wave.waveId === waveId
            );
            if (waveIndex === -1) {
                return { ...state };
            }

            const currentWave = updatedWaves[waveIndex];
            if (currentWave.items.length === 0) {
                currentWave.items.push(data);
            } else {
                const unitIndex = currentWave.items.findIndex(
                    (item: GuideAttackUnit) => item.unitId === data.unitId
                );
                if (unitIndex === -1) {
                    currentWave.items.push(data);
                } else {
                    currentWave.items[unitIndex] = data;
                }
            }

            return { ...state, wavesUnits: [...updatedWaves] };
        }
        case _REDUCER_REMOVE_UNITS_: {
            const { waveId, unitId } = action.payload;
            const updatedWaves = [...wavesUnits];

            const waveIndex = updatedWaves.findIndex(
                (wave: Wave) => wave.waveId === waveId
            );
            if (waveIndex === -1) {
                return { ...state };
            }

            const currentWave = state.wavesUnits[waveIndex];
            const unitIndex = currentWave.items.findIndex(
                (item: GuideAttackUnit) => item.unitId === unitId
            );
            if (unitIndex === -1) {
                return { ...state };
            } else {
                currentWave.items.splice(unitIndex, 1);
                return { ...state, wavesUnits: [...updatedWaves] };
            }
        }
        //endunits
        //bandits
        case _REDUCER_ADD_BANDITS_WAVE_: {
            const newWave: Wave = {
                waveId: action.payload,
                items: [new GuideAttackUnit(_GENERATE_UNIQUE_ID_(), 0, 0)],
            };
            return { ...state, wavesBandits: [...wavesBandits, newWave] };
        }
        case _REDUCER_REMOVE_BANDITS_WAVE_: {
            const waveIdToRemove = action.payload;
            const updatedWaves = wavesBandits.filter(
                (wave: Wave) => wave.waveId !== waveIdToRemove
            );
            return { ...state, wavesBandits: updatedWaves };
        }
        case _REDUCER_EDIT_BANDITS_: {
            const { waveId, data } = action.payload;
            const updatedWaves = [...wavesBandits];

            const waveIndex = updatedWaves.findIndex(
                (wave: Wave) => wave.waveId === waveId
            );
            if (waveIndex === -1) {
                return { ...state };
            }

            const currentWave = updatedWaves[waveIndex];
            if (currentWave.items.length === 0) {
                currentWave.items.push(data);
            } else {
                const unitIndex = currentWave.items.findIndex(
                    (item: GuideAttackUnit) => item.unitId === data.unitId
                );
                if (unitIndex === -1) {
                    currentWave.items.push(data);
                } else {
                    currentWave.items[unitIndex] = data;
                }
            }

            return { ...state, wavesBandits: [...updatedWaves] };
        }
        case _REDUCER_REMOVE_BANDITS_: {
            const { waveId, unitId } = action.payload;
            const updatedWaves = [...wavesBandits];

            const waveIndex = updatedWaves.findIndex(
                (wave: Wave) => wave.waveId === waveId
            );
            if (waveIndex === -1) {
                return { ...state };
            }

            const currentWave = state.wavesBandits[waveIndex];
            const unitIndex = currentWave.items.findIndex(
                (item: GuideAttackUnit) => item.unitId === unitId
            );
            if (unitIndex === -1) {
                return { ...state };
            } else {
                currentWave.items.splice(unitIndex, 1);
                return { ...state, wavesBandits: [...updatedWaves] };
            }
        }
        //end bandits
        default:
            return {
                ...state,
                resultMsg: "Błąd. Skontaktuj się z administratorem strony",
            };
    }
};
