import type { SampleProgram } from '../types/compiler';

export const samplePrograms: SampleProgram[] = [
  {
    id: 'lexing-error',
    name: '1. Lexing Error 🔤 (Unterminated String)',
    description: 'Triggers the Lexing stage with an unterminated string literal',
    category: 'syntax',
    expectedEmoji: '🔤',
    code: `#include <iostream>
using namespace std;

int main() {
    // Missing closing double quote triggers lexing error
    cout << "Unterminated string literal... << endl;
    return 0;
}
`,
  },
  {
    id: 'missing-semicolon',
    name: '2. Parsing Error ✂️ (Missing Semicolon)',
    description: 'Line 6 is missing a statement terminator ;',
    category: 'syntax',
    expectedEmoji: '✂️',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Compiling EmojiCompiler..." << endl
    cout << "Spot the missing token!" << endl;
    return 0;
}
`,
  },
  {
    id: 'ghost-variable',
    name: '3. Semantic Error 👻 (Undeclared Var)',
    description: 'Using variable without declaring its type or scope',
    category: 'types',
    expectedEmoji: '👻',
    code: `#include <iostream>
using namespace std;

int main() {
    // 'score' was never declared in this scope
    score = 100;
    cout << "Player score: " << score << endl;
    return 0;
}
`,
  },
  {
    id: 'segfault-runtime',
    name: '4. Assembly/Runtime 💥 (Segfault)',
    description: 'Dereferencing a null pointer causes memory access violation',
    category: 'runtime',
    expectedEmoji: '💥',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "About to touch forbidden memory..." << endl;
    int* ptr = nullptr;
    *ptr = 42; // SIGSEGV Segmentation fault
    return 0;
}
`,
  },
  {
    id: 'nested-complexity',
    name: '5. Nested Loops 🐢 (Complexity O(n³))',
    description: 'Triple nested loop that triggers the complexity warning',
    category: 'logic',
    expectedEmoji: '🐢',
    code: `#include <iostream>
using namespace std;

int main() {
    int n = 50;
    long long operations = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                operations++;
            }
        }
    }
    cout << "Total operations: " << operations << endl;
    return 0;
}
`,
  },
  {
    id: 'clean-program',
    name: '6. Clean Compile ✨ (Zero Errors)',
    description: 'Spotless program with 0 errors that triggers the celebration burst',
    category: 'clean',
    expectedEmoji: '✨',
    code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string status = "Zero errors detected.";
    cout << "Terminal ready: " << status << endl;
    return 0;
}
`,
  },
  {
    id: 'two-sum',
    name: '7. Two Sum 🎯 (Hash Map O(N))',
    description: 'Find two numbers adding up to target using unordered_map',
    category: 'algorithm',
    expectedEmoji: '🎯',
    code: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;

    unordered_map<int, int> seen;
    for (size_t i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            cout << "Found pair at indices: " << seen[complement] << " and " << i << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    cout << "No pair found" << endl;
    return 0;
}
`,
  },
  {
    id: 'valid-parentheses',
    name: '8. Valid Parentheses 🧱 (Stack)',
    description: 'Verify bracket matching using std::stack',
    category: 'algorithm',
    expectedEmoji: '🧱',
    code: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

bool isValid(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) {
                return false;
            }
            st.pop();
        }
    }
    return st.empty();
}

int main() {
    string expr = "({[]})";
    cout << "Checking '" << expr << "': " << (isValid(expr) ? "Valid 🟢" : "Invalid 🔴") << endl;
    return 0;
}
`,
  },
  {
    id: 'max-subarray',
    name: '9. Max Subarray 📈 (Kadane O(N))',
    description: 'Find contiguous subarray with maximum sum in linear time',
    category: 'algorithm',
    expectedEmoji: '📈',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int maxSoFar = nums[0];
    int currMax = nums[0];

    for (size_t i = 1; i < nums.size(); i++) {
        currMax = max(nums[i], currMax + nums[i]);
        maxSoFar = max(maxSoFar, currMax);
    }
    cout << "Maximum contiguous subarray sum: " << maxSoFar << endl;
    return 0;
}
`,
  },
  {
    id: 'binary-search',
    name: '10. Binary Search 🔍 (O(log N))',
    description: 'Fast logarithmic search on sorted vector',
    category: 'algorithm',
    expectedEmoji: '🔍',
    code: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 15, 20};
    int target = 7;
    int idx = binarySearch(arr, target);
    cout << "Target " << target << " found at index: " << idx << endl;
    return 0;
}
`,
  },
];
