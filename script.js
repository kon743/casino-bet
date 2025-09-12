// script.js の内容をすべてこれに置き換えてください

document.addEventListener('DOMContentLoaded', () => {

    // --- 設定ここから ---
    const PLAYER_COUNT = 4;
    const CHIPS = [
        { name: '1', value: 1 },
        { name: '5', value: 5 },
        { name: '10', value: 10 },
        { name: '25', value: 25 },
        { name: '100', value: 100 },
    ];
    // --- 設定ここまで ---

    const playerContainer = document.getElementById('player-container');

    for (let i = 0; i < PLAYER_COUNT; i++) {
        const playerArea = document.createElement('div');
        playerArea.classList.add('player-area');
        playerArea.dataset.playerId = i;

        let chipControlsHTML = '';
        CHIPS.forEach(chip => {
            chipControlsHTML += `
                <div class="chip-control" data-value="${chip.value}">
                    <span class="chip-label">${chip.name} チップ</span>
                    <div class="chip-buttons">
                        <button class="minus-btn">-</button>
                        <!-- ★変更点1: spanをinputに変更 -->
                        <input type="number" class="chip-count" value="0" min="0">
                        <button class="plus-btn">+</button>
                    </div>
                </div>
            `;
        });

        playerArea.innerHTML = `
            <input type="text" class="player-name" placeholder="Player ${i + 1}">
            ${chipControlsHTML}
            <div class="total-amount">合計: <span>0</span></div>
            <button class="clear-btn">クリア</button>
        `;
        playerContainer.appendChild(playerArea);
    }

    // 「クリック」イベントの処理
    playerContainer.addEventListener('click', (e) => {
        const playerArea = e.target.closest('.player-area');
        if (!playerArea) return;

        // ★変更点2: inputの値を操作するように変更
        if (e.target.classList.contains('plus-btn')) {
            const countInput = e.target.previousElementSibling;
            let count = parseInt(countInput.value);
            count++;
            countInput.value = count;
            updateTotal(playerArea);
        }

        if (e.target.classList.contains('minus-btn')) {
            const countInput = e.target.nextElementSibling;
            let count = parseInt(countInput.value);
            if (count > 0) {
                count--;
                countInput.value = count;
                updateTotal(playerArea);
            }
        }

        if (e.target.classList.contains('clear-btn')) {
            clearPlayer(playerArea);
        }
    });

    // ★追加: 「直接入力」イベントの処理
    playerContainer.addEventListener('input', (e) => {
        const playerArea = e.target.closest('.player-area');
        if (!playerArea) return;

        // chip-countクラスのinputが変更されたら合計を更新
        if (e.target.classList.contains('chip-count')) {
            // マイナス値や空欄を防ぐ
            if (e.target.value === '' || parseInt(e.target.value) < 0) {
                e.target.value = 0;
            }
            updateTotal(playerArea);
        }
        playerContainer.addEventListener('focusin', (e) => {
    // chip-countクラスのinputが対象で、かつ値が"0"の場合
    if (e.target.classList.contains('chip-count') && e.target.value === '0') {
        e.target.value = ''; // 中身を空にする
    }
    });
    });

    document.getElementById('clear-all-btn').addEventListener('click', () => {
        document.querySelectorAll('.player-area').forEach(clearPlayer);
    });

    function updateTotal(playerArea) {
        let total = 0;
        playerArea.querySelectorAll('.chip-control').forEach(control => {
            const value = parseInt(control.dataset.value);
            // ★変更点3: inputのvalueから値を取得
            const count = parseInt(control.querySelector('.chip-count').value) || 0; // 空の場合を考慮
            total += value * count;
        });
        playerArea.querySelector('.total-amount span').textContent = total;
    }

    function clearPlayer(playerArea) {
        // ★変更点4: inputのvalueをリセット
        playerArea.querySelectorAll('.chip-count').forEach(input => {
            input.value = '0';
        });
        updateTotal(playerArea);
    }
});
playerContainer.addEventListener('focusout', (e) => {
    // chip-countクラスのinputが対象で、かつ中身が空の場合
    if (e.target.classList.contains('chip-count') && e.target.value === '') {
        e.target.value = '0'; // "0"に戻す
    }
});