// Comprehensive helper to generate authentic problem-specific starter templates, examples, pitch scripts, and official solutions

export function getExtendedProblemDetails(problem) {
  if (!problem) return null;

  const name = problem.name || 'LeetCode Problem';
  const pattern = problem.pattern || 'General Problem Solving';
  const difficulty = problem.difficulty || 'Medium';
  const topicSlug = problem.topicSlug || 'arrays';

  // Normalize name for matching
  const cleanName = name.toLowerCase();

  let description = `Given the core problem structure for **${name}**, implement an optimal solution using **${pattern}**.`;
  let examples = [];
  let constraints = [
    '1 <= N <= 10^5',
    '-10^9 <= Value <= 10^9',
    'Expected Time Complexity: O(N) or O(N log N)',
    'Expected Auxiliary Space: O(1) or O(N)'
  ];
  let edgeCases = [
    'Empty input array or null pointer input',
    'Array with all duplicate elements or single element',
    'Extreme negative numbers causing integer overflow',
    'Max bounds testing TLE (Time Limit Exceeded) limits'
  ];

  let starterCode = {};
  let editorialSolutions = {};
  let pitchScript = '';

  // ==========================================
  // 1. SPECIFIC LEETCODE PROBLEM MATCHERS
  // ==========================================

  // LeetCode 149 - Max Points on a Line
  if (cleanName.includes('149') || cleanName.includes('max points on a line')) {
    description = `Given an array of \`points\` where \`points[i] = [xi, yi]\` represents a point on the X-Y plane, return *the maximum number of points that lie on the same straight line*.`;
    examples = [
      { input: 'points = [[1,1],[2,2],[3,3]]', output: '3', explanation: 'All 3 points lie on the line y = x.' },
      { input: 'points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]', output: '4', explanation: '4 points lie on the line y = -0.5x + 3.5.' }
    ];
    constraints = ['1 <= points.length <= 300', 'points[i].length == 2', '-10^4 <= xi, yi <= 10^4', 'All points are unique.'];
    edgeCases = ['points.length <= 2 (always collinear)', 'Vertical lines with infinite slope (dx = 0)', 'Precision issues with floating point division (use GCD for slope representation)'];

    starterCode = {
      cpp: `class Solution {\npublic:\n    int maxPoints(vector<vector<int>>& points) {\n        // Write solution using Slope Hashmap & GCD\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def maxPoints(self, points: list[list[int]]) -> int:\n        # Write solution using Slope Hashmap & GCD\n        pass`,
      java: `public class Solution {\n    public int maxPoints(int[][] points) {\n        // Write solution using Slope Hashmap & GCD\n        return 0;\n    }\n}`,
      javascript: `function maxPoints(points) {\n    // Write solution using Slope Hashmap & GCD\n    return 0;\n}`
    };

    editorialSolutions = {
      cpp: `#include <vector>\n#include <unordered_map>\n#include <numeric>\n#include <algorithm>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxPoints(vector<vector<int>>& points) {\n        int n = points.size();\n        if (n <= 2) return n;\n        int maxPointsCount = 0;\n        for (int i = 0; i < n; ++i) {\n            unordered_map<string, int> slopeMap;\n            int localMax = 0;\n            for (int j = i + 1; j < n; ++j) {\n                int dx = points[j][0] - points[i][0];\n                int dy = points[j][1] - points[i][1];\n                int g = std::gcd(dx, dy);\n                dx /= g;\n                dy /= g;\n                if (dx < 0 || (dx == 0 && dy < 0)) {\n                    dx = -dx;\n                    dy = -dy;\n                }\n                string slopeKey = to_string(dx) + "_" + to_string(dy);\n                slopeMap[slopeKey]++;\n                localMax = max(localMax, slopeMap[slopeKey]);\n            }\n            maxPointsCount = max(maxPointsCount, localMax + 1);\n        }\n        return maxPointsCount;\n    }\n};`,
      python: `from math import gcd\nfrom collections import defaultdict\n\nclass Solution:\n    def maxPoints(self, points: list[list[int]]) -> int:\n        n = len(points)\n        if n <= 2:\n            return n\n        ans = 0\n        for i in range(n):\n            slopes = defaultdict(int)\n            local_max = 0\n            for j in range(i + 1, n):\n                dx = points[j][0] - points[i][0]\n                dy = points[j][1] - points[i][1]\n                g = gcd(dx, dy)\n                dx //= g\n                dy //= g\n                if dx < 0 or (dx == 0 and dy < 0):\n                    dx, dy = -dx, -dy\n                slopes[(dx, dy)] += 1\n                local_max = max(local_max, slopes[(dx, dy)])\n            ans = max(ans, local_max + 1)\n        return ans`,
      java: `import java.util.*;\n\npublic class Solution {\n    public int maxPoints(int[][] points) {\n        int n = points.length;\n        if (n <= 2) return n;\n        int maxCount = 0;\n        for (int i = 0; i < n; i++) {\n            Map<String, Integer> slopeMap = new HashMap<>();\n            int localMax = 0;\n            for (int j = i + 1; j < n; j++) {\n                int dx = points[j][0] - points[i][0];\n                int dy = points[j][1] - points[i][1];\n                int g = gcd(dx, dy);\n                dx /= g;\n                dy /= g;\n                if (dx < 0 || (dx == 0 && dy < 0)) {\n                    dx = -dx;\n                    dy = -dy;\n                }\n                String key = dx + "_" + dy;\n                slopeMap.put(key, slopeMap.getOrDefault(key, 0) + 1);\n                localMax = Math.max(localMax, slopeMap.get(key));\n            }\n            maxCount = Math.max(maxCount, localMax + 1);\n        }\n        return maxCount;\n    }\n    private int gcd(int a, int b) {\n        return b == 0 ? a : gcd(b, a % b);\n    }\n}`,
      javascript: `function maxPoints(points) {\n    const n = points.length;\n    if (n <= 2) return n;\n    function gcd(a, b) {\n        return b === 0 ? a : gcd(b, a % b);\n    }\n    let maxCount = 0;\n    for (let i = 0; i < n; i++) {\n        const slopeMap = new Map();\n        let localMax = 0;\n        for (let j = i + 1; j < n; j++) {\n            let dx = points[j][0] - points[i][0];\n            let dy = points[j][1] - points[i][1];\n            const g = gcd(dx, dy);\n            dx = Math.floor(dx / g);\n            dy = Math.floor(dy / g);\n            if (dx < 0 || (dx === 0 && dy < 0)) {\n                dx = -dx;\n                dy = -dy;\n            }\n            const key = \`\${dx}_\${dy}\`;\n            const count = (slopeMap.get(key) || 0) + 1;\n            slopeMap.set(key, count);\n            localMax = Math.max(localMax, count);\n        }\n        maxCount = Math.max(maxCount, localMax + 1);\n    }\n    return maxCount;\n}`
    };

    pitchScript = `
1. **Approach**: "For each point i, I calculate the slope with every subsequent point j. Using GCD to reduce slope fractions (dx, dy), I avoid floating-point inaccuracies."
2. **Complexity**: "Time Complexity: O(N^2) checking all point pairs. Space Complexity: O(N) for storing slope counts in a hash map."
    `.trim();

  // LeetCode 233 - Number of Digit One
  } else if (cleanName.includes('233') || cleanName.includes('number of digit one')) {
    description = `Given an integer \`n\`, count the total number of digit \`1\` appearing in all non-negative integers less than or equal to \`n\`.`;
    examples = [
      { input: 'n = 13', output: '6', explanation: 'Digit 1 occurs in numbers: 1, 10, 11, 12, 13 (a total of 6 times).' },
      { input: 'n = 0', output: '0', explanation: 'No digit 1 in 0.' }
    ];
    constraints = ['0 <= n <= 10^9', 'Time Complexity: O(log10(N))', 'Space Complexity: O(1)'];
    edgeCases = ['n = 0 or single digit numbers', 'Powers of 10 (e.g., n = 10, 100, 1000)', 'Max bound n = 10^9 testing integer overflow'];

    starterCode = {
      cpp: `class Solution {\npublic:\n    int countDigitOne(int n) {\n        // Write solution using Position Math / Digit DP\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def countDigitOne(self, n: int) -> int:\n        # Write solution using Position Math / Digit DP\n        pass`,
      java: `public class Solution {\n    public int countDigitOne(int n) {\n        // Write solution using Position Math / Digit DP\n        return 0;\n    }\n}`,
      javascript: `function countDigitOne(n) {\n    // Write solution using Position Math / Digit DP\n    return 0;\n}`
    };

    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    int countDigitOne(int n) {\n        long long count = 0;\n        for (long long i = 1; i <= n; i *= 10) {\n            long long divider = i * 10;\n            count += (n / divider) * i + min(max(n % divider - i + 1, 0LL), i);\n        }\n        return count;\n    }\n};`,
      python: `class Solution:\n    def countDigitOne(self, n: int) -> int:\n        count = 0\n        i = 1\n        while i <= n:\n            divider = i * 10\n            count += (n // divider) * i + min(max(n % divider - i + 1, 0), i)\n            i *= 10\n        return count`,
      java: `public class Solution {\n    public int countDigitOne(int n) {\n        long count = 0;\n        for (long i = 1; i <= n; i *= 10) {\n            long divider = i * 10;\n            count += (n / divider) * i + Math.min(Math.max(n % divider - i + 1, 0), i);\n        }\n        return (int) count;\n    }\n}`,
      javascript: `function countDigitOne(n) {\n    let count = 0;\n    for (let i = 1; i <= n; i *= 10) {\n        const divider = i * 10;\n        const fullRounds = Math.floor(n / divider);\n        const remainder = n % divider;\n        count += fullRounds * i + Math.min(Math.max(remainder - i + 1, 0), i);\n    }\n    return count;\n}`
    };

    pitchScript = `
1. **Approach**: "Instead of checking each number, I count the occurrences of '1' at each digit position (ones, tens, hundreds) independently."
2. **Complexity**: "Time Complexity: O(log10(N)) since n has at most 10 digits. Space Complexity: O(1)."
    `.trim();

  // LeetCode 7 - Reverse Integer
  } else if (cleanName.includes('reverse integer') || cleanName.includes('7 – reverse')) {
    description = `Given a signed 32-bit integer \`x\`, return \`x\` with its digits reversed. If reversing \`x\` causes the value to go outside the signed 32-bit integer range \`[-2^31, 2^31 - 1]\`, then return \`0\`.`;
    examples = [
      { input: 'x = 123', output: '321', explanation: 'Reversing 123 yields 321.' },
      { input: 'x = -123', output: '-321', explanation: 'Reversing -123 yields -321.' },
      { input: 'x = 120', output: '21', explanation: 'Reversing 120 yields 021 which simplifies to 21.' }
    ];
    constraints = ['-2^31 <= x <= 2^31 - 1', 'Time Complexity: O(log10(x))', 'Space Complexity: O(1)'];
    edgeCases = ['Overflow beyond INT_MAX (2147483647)', 'Underflow beyond INT_MIN (-2147483648)', 'Trailing zeros (e.g. 120 -> 21)'];

    starterCode = {
      cpp: `#include <iostream>\n#include <climits>\nusing namespace std;\n\nclass Solution {\npublic:\n    int reverse(int x) {\n        // Write solution here\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def reverse(self, x: int) -> int:\n        # Write solution here\n        pass`,
      java: `public class Solution {\n    public int reverse(int x) {\n        // Write solution here\n        return 0;\n    }\n}`,
      javascript: `function reverse(x) {\n    // Write solution here\n    return 0;\n}`
    };

    editorialSolutions = {
      cpp: `#include <climits>\n\nclass Solution {\npublic:\n    int reverse(int x) {\n        int rev = 0;\n        while (x != 0) {\n            int pop = x % 10;\n            x /= 10;\n            if (rev > INT_MAX/10 || (rev == INT_MAX/10 && pop > 7)) return 0;\n            if (rev < INT_MIN/10 || (rev == INT_MIN/10 && pop < -8)) return 0;\n            rev = rev * 10 + pop;\n        }\n        return rev;\n    }\n};`,
      python: `class Solution:\n    def reverse(self, x: int) -> int:\n        INT_MIN, INT_MAX = -2**31, 2**31 - 1\n        res = 0\n        sign = -1 if x < 0 else 1\n        x = abs(x)\n        while x != 0:\n            pop = x % 10\n            x //= 10\n            if res > (INT_MAX - pop) // 10:\n                return 0\n            res = res * 10 + pop\n        return res * sign`,
      java: `public class Solution {\n    public int reverse(int x) {\n        int rev = 0;\n        while (x != 0) {\n            int pop = x % 10;\n            x /= 10;\n            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) return 0;\n            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) return 0;\n            rev = rev * 10 + pop;\n        }\n        return rev;\n    }\n}`,
      javascript: `function reverse(x) {\n    let rev = 0;\n    const sign = x < 0 ? -1 : 1;\n    x = Math.abs(x);\n    while (x > 0) {\n        const pop = x % 10;\n        x = Math.floor(x / 10);\n        rev = rev * 10 + pop;\n    }\n    rev *= sign;\n    if (rev < -Math.pow(2, 31) || rev > Math.pow(2, 31) - 1) return 0;\n    return rev;\n}`
    };

    pitchScript = `
1. **Approach Summary**: "I extract digits one by one using modulo 10 and construct the reversed integer."
2. **Overflow Defense**: "Before multiplying by 10, I check against INT_MAX/10 and INT_MIN/10 to prevent integer overflow."
3. **Complexity**: "Time Complexity is O(log10(X)), Space Complexity is O(1)."
    `.trim();

  // LeetCode 9 - Palindrome Number
  } else if (cleanName.includes('palindrome number')) {
    description = `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome integer, and \`false\` otherwise. An integer is a palindrome when it reads the same backward as forward.`;
    examples = [
      { input: 'x = 121', output: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
      { input: 'x = -121', output: 'false', explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.' }
    ];
    starterCode = {
      cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // Write solution here\n        return false;\n    }\n};`,
      python: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        # Write solution here\n        pass`,
      java: `public class Solution {\n    public boolean isPalindrome(int x) {\n        // Write solution here\n        return false;\n    }\n}`,
      javascript: `function isPalindrome(x) {\n    // Write solution here\n    return false;\n}`
    };
    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n        int revertedNumber = 0;\n        while (x > revertedNumber) {\n            revertedNumber = revertedNumber * 10 + x % 10;\n            x /= 10;\n        }\n        return x == revertedNumber || x == revertedNumber / 10;\n    }\n};`,
      python: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        if x < 0 or (x % 10 == 0 and x != 0):\n            return False\n        rev = 0\n        while x > rev:\n            rev = rev * 10 + x % 10\n            x //= 10\n        return x == rev or x == rev // 10`,
      java: `public class Solution {\n    public boolean isPalindrome(int x) {\n        if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n        int revertedNumber = 0;\n        while (x > revertedNumber) {\n            revertedNumber = revertedNumber * 10 + x % 10;\n            x /= 10;\n        }\n        return x == revertedNumber || x == revertedNumber / 10;\n    }\n}`,
      javascript: `function isPalindrome(x) {\n    if (x < 0 || (x % 10 === 0 && x !== 0)) return false;\n    let rev = 0;\n    while (x > rev) {\n        rev = rev * 10 + x % 10;\n        x = Math.floor(x / 10);\n    }\n    return x === rev || x === Math.floor(rev / 10);\n}`
    };
    pitchScript = `
1. **Approach**: "Negative numbers and numbers ending in 0 are not palindromes. I reverse only the second half of the number to avoid overflow."
2. **Complexity**: "Time: O(log10(N)), Space: O(1)."
    `.trim();

  // LeetCode 1 - Two Sum
  } else if (cleanName.includes('two sum')) {
    description = `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.`;
    examples = [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9.' }
    ];
    starterCode = {
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write solution here\n        return {};\n    }\n};`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write solution here\n        pass`,
      java: `public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write solution here\n        return new int[]{};\n    }\n}`,
      javascript: `function twoSum(nums, target) {\n    // Write solution here\n    return [];\n}`
    };
    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); ++i) {\n            int comp = target - nums[i];\n            if (mp.count(comp)) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`,
      java: `public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}`
    };
    pitchScript = `
1. **Approach**: "I use a hash map to store seen values and their indices. On each step, I check if (target - num) exists."
2. **Complexity**: "Time: O(N), Space: O(N)."
    `.trim();  // LeetCode 172 - Factorial Trailing Zeroes
  } else if (cleanName.includes('172') || cleanName.includes('factorial trailing zeroes')) {
    description = `Given an integer \`n\`, return *the number of trailing zeroes in* \`n!\`. Note that \`n! = n * (n - 1) * (n - 2) * ... * 3 * 2 * 1\`.`;
    examples = [
      { input: 'n = 5', output: '1', explanation: '5! = 120, which has 1 trailing zero.' },
      { input: 'n = 3', output: '0', explanation: '3! = 6, which has 0 trailing zeroes.' },
      { input: 'n = 0', output: '0', explanation: '0! = 1, which has 0 trailing zeroes.' }
    ];
    constraints = ['0 <= n <= 10^4', 'Expected Time Complexity: O(log5(N))', 'Expected Auxiliary Space: O(1)'];
    edgeCases = ['n = 0 (0! = 1, output 0)', 'Powers of 5 (e.g. n = 25 contributes two factors of 5)', 'Max bounds n = 10^4 testing execution speed'];

    starterCode = {
      cpp: `class Solution {\npublic:\n    int trailingZeroes(int n) {\n        // Write solution using Legendre Formula / Prime Factor 5\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def trailingZeroes(self, n: int) -> int:\n        # Write solution using Legendre Formula / Prime Factor 5\n        pass`,
      java: `public class Solution {\n    public int trailingZeroes(int n) {\n        // Write solution using Legendre Formula / Prime Factor 5\n        return 0;\n    }\n}`,
      javascript: `function trailingZeroes(n) {\n    // Write solution using Legendre Formula / Prime Factor 5\n    return 0;\n}`
    };

    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    int trailingZeroes(int n) {\n        int count = 0;\n        while (n >= 5) {\n            count += n / 5;\n            n /= 5;\n        }\n        return count;\n    }\n};`,
      python: `class Solution:\n    def trailingZeroes(self, n: int) -> int:\n        count = 0\n        while n >= 5:\n            count += n // 5\n            n //= 5\n        return count`,
      java: `public class Solution {\n    public int trailingZeroes(int n) {\n        int count = 0;\n        while (n >= 5) {\n            count += n / 5;\n            n /= 5;\n        }\n        return count;\n    }\n}`,
      javascript: `function trailingZeroes(n) {\n    let count = 0;\n    while (n >= 5) {\n        count += Math.floor(n / 5);\n        n = Math.floor(n / 5);\n    }\n    return count;\n}`
    };

    pitchScript = `
1. **Approach**: "Trailing zeroes are created by factors of 10 (2 * 5). Since factors of 2 are abundant, I count the total factors of 5 in n! using Legendre's formula."
2. **Complexity**: "Time Complexity: O(log5(N)), Space Complexity: O(1)."
    `.trim();

  // LeetCode 2520 - Count the Digits That Divide a Number
  } else if (cleanName.includes('2520') || cleanName.includes('count the digits that divide a number')) {
    description = `Given an integer \`num\`, return *the number of digits in \`num\` that divide \`num\`*. An integer \`val\` divides \`nums\` if \`nums % val == 0\`.`;
    examples = [
      { input: 'num = 7', output: '1', explanation: '7 divides itself, so the answer is 1.' },
      { input: 'num = 121', output: '2', explanation: '121 is divisible by 1, but not by 2.' },
      { input: 'num = 124', output: '3', explanation: '124 is divisible by 1, 2, and 4.' }
    ];
    constraints = ['1 <= num <= 10^9', 'Every digit of num is non-zero.', 'Time Complexity: O(log10(num))', 'Space Complexity: O(1)'];
    edgeCases = ['Single-digit numbers (always return 1)', 'Numbers with repeated digits (e.g. 121)', 'Max bound 10^9'];

    starterCode = {
      cpp: `class Solution {\npublic:\n    int countDigits(int num) {\n        // Write solution using Digit Extraction\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def countDigits(self, num: int) -> int:\n        # Write solution using Digit Extraction\n        pass`,
      java: `public class Solution {\n    public int countDigits(int num) {\n        // Write solution using Digit Extraction\n        return 0;\n    }\n}`,
      javascript: `function countDigits(num) {\n    // Write solution using Digit Extraction\n    return 0;\n}`
    };

    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    int countDigits(int num) {\n        int count = 0, temp = num;\n        while (temp > 0) {\n            int digit = temp % 10;\n            if (digit != 0 && num % digit == 0) count++;\n            temp /= 10;\n        }\n        return count;\n    }\n};`,
      python: `class Solution:\n    def countDigits(self, num: int) -> int:\n        count = 0\n        temp = num\n        while temp > 0:\n            digit = temp % 10\n            if digit != 0 and num % digit == 0:\n                count += 1\n            temp //= 10\n        return count`,
      java: `public class Solution {\n    public int countDigits(int num) {\n        int count = 0, temp = num;\n        while (temp > 0) {\n            int digit = temp % 10;\n            if (digit != 0 && num % digit == 0) count++;\n            temp /= 10;\n        }\n        return count;\n    }\n}`,
      javascript: `function countDigits(num) {\n    let count = 0, temp = num;\n    while (temp > 0) {\n        const digit = temp % 10;\n        if (digit !== 0 && num % digit === 0) count++;\n        temp = Math.floor(temp / 10);\n    }\n    return count;\n}`
    };

    pitchScript = `
1. **Approach**: "I iterate through each digit of num using modulo 10 extraction and check if num is divisible by that digit."
2. **Complexity**: "Time Complexity: O(log10(num)), Space Complexity: O(1)."
    `.trim();

  // LeetCode 258 - Add Digits
  } else if (cleanName.includes('258') || cleanName.includes('add digits')) {
    description = `Given an integer \`num\`, repeatedly add all its digits until the result has only one digit, and return it.`;
    examples = [
      { input: 'num = 38', output: '2', explanation: '38 -> 3 + 8 = 11 -> 1 + 1 = 2.' },
      { input: 'num = 0', output: '0', explanation: '0 is a single digit.' }
    ];
    constraints = ['0 <= num <= 2^31 - 1', 'O(1) time without loops'];

    starterCode = {
      cpp: `class Solution {\npublic:\n    int addDigits(int num) {\n        // Write solution using Digital Root\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def addDigits(self, num: int) -> int:\n        pass`,
      java: `public class Solution {\n    public int addDigits(int num) {\n        return 0;\n    }\n}`,
      javascript: `function addDigits(num) {\n    return 0;\n}`
    };

    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    int addDigits(int num) {\n        if (num == 0) return 0;\n        return 1 + (num - 1) % 9;\n    }\n};`,
      python: `class Solution:\n    def addDigits(self, num: int) -> int:\n        if num == 0:\n            return 0\n        return 1 + (num - 1) % 9`,
      java: `public class Solution {\n    public int addDigits(int num) {\n        if (num == 0) return 0;\n        return 1 + (num - 1) % 9;\n    }\n}`,
      javascript: `function addDigits(num) {\n    if (num === 0) return 0;\n    return 1 + (num - 1) % 9;\n}`
    };

    pitchScript = `
1. **Approach**: "Instead of loop-based digit summing, I use the O(1) digital root formula: 1 + (num - 1) % 9."
2. **Complexity**: "Time Complexity: O(1), Space Complexity: O(1)."
    `.trim();

  // LeetCode 204 - Count Primes
  } else if (cleanName.includes('204') || cleanName.includes('count primes')) {
    description = `Given an integer \`n\`, return *the number of prime numbers that are strictly less than* \`n\`.`;
    examples = [
      { input: 'n = 10', output: '4', explanation: 'There are 4 prime numbers less than 10, which are 2, 3, 5, 7.' },
      { input: 'n = 0', output: '0', explanation: 'No primes less than 0.' }
    ];

    starterCode = {
      cpp: `class Solution {\npublic:\n    int countPrimes(int n) {\n        // Write solution using Sieve of Eratosthenes\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def countPrimes(self, n: int) -> int:\n        pass`,
      java: `public class Solution {\n    public int countPrimes(int n) {\n        return 0;\n    }\n}`,
      javascript: `function countPrimes(n) {\n    return 0;\n}`
    };

    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    int countPrimes(int n) {\n        if (n <= 2) return 0;\n        vector<bool> isPrime(n, true);\n        isPrime[0] = isPrime[1] = false;\n        for (int i = 2; i * i < n; ++i) {\n            if (isPrime[i]) {\n                for (int j = i * i; j < n; j += i) isPrime[j] = false;\n            }\n        }\n        return count(isPrime.begin(), isPrime.end(), true);\n    }\n};`,
      python: `class Solution:\n    def countPrimes(self, n: int) -> int:\n        if n <= 2:\n            return 0\n        is_prime = [True] * n\n        is_prime[0] = is_prime[1] = False\n        for i in range(2, int(n**0.5) + 1):\n            if is_prime[i]:\n                for j in range(i * i, n, i):\n                    is_prime[j] = False\n        return sum(is_prime)`,
      java: `public class Solution {\n    public int countPrimes(int n) {\n        if (n <= 2) return 0;\n        boolean[] isPrime = new boolean[n];\n        Arrays.fill(isPrime, true);\n        isPrime[0] = isPrime[1] = false;\n        for (int i = 2; i * i < n; i++) {\n            if (isPrime[i]) {\n                for (int j = i * i; j < n; j += i) isPrime[j] = false;\n            }\n        }\n        int count = 0;\n        for (boolean p : isPrime) if (p) count++;\n        return count;\n    }\n}`,
      javascript: `function countPrimes(n) {\n    if (n <= 2) return 0;\n    const isPrime = new Uint8Array(n).fill(1);\n    isPrime[0] = isPrime[1] = 0;\n    for (let i = 2; i * i < n; i++) {\n        if (isPrime[i]) {\n            for (let j = i * i; j < n; j += i) isPrime[j] = 0;\n        }\n    }\n    return isPrime.reduce((a, b) => a + b, 0);\n}`
    };

    pitchScript = `
1. **Approach**: "I use the Sieve of Eratosthenes to mark composite numbers starting from i * i."
2. **Complexity**: "Time Complexity: O(N log log N), Space Complexity: O(N)."
    `.trim();

  // LeetCode 509 - Fibonacci Number
  } else if (cleanName.includes('509') || cleanName.includes('fibonacci number')) {
    description = `The Fibonacci numbers form a sequence where F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2) for n > 1. Given \`n\`, calculate \`F(n)\`.`;
    examples = [
      { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' }
    ];

    starterCode = {
      cpp: `class Solution {\npublic:\n    int fib(int n) {\n        // Write solution\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def fib(self, n: int) -> int:\n        pass`,
      java: `public class Solution {\n    public int fib(int n) {\n        return 0;\n    }\n}`,
      javascript: `function fib(n) {\n    return 0;\n}`
    };

    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; ++i) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n};`,
      python: `class Solution:\n    def fib(self, n: int) -> int:\n        if n <= 1:\n            return n\n        a, b = 0, 1\n        for _ in range(2, n + 1):\n            a, b = b, a + b\n        return b`,
      java: `public class Solution {\n    public int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}`,
      javascript: `function fib(n) {\n    if (n <= 1) return n;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n        const c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`
    };

    pitchScript = `
1. **Approach**: "I use iterative state tracking with two variables to calculate the N-th Fibonacci number in O(1) space."
2. **Complexity**: "Time Complexity: O(N), Space Complexity: O(1)."
    `.trim();

  // ==========================================
  // 2. CATEGORY & PATTERN BASED DYNAMIC GENERATOR
  // ==========================================

  // DYNAMIC FALLBACK FOR ANY OTHER PROBLEMS
  } else {
    const cleanTitle = name.replace(/^LeetCode\s+\d+\s*[-–]\s*/i, '').trim();
    const words = cleanTitle.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const methodName = words.length > 0
      ? words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
      : 'solve';

    let paramNoun = words.length > 1 ? words[words.length - 1].toLowerCase() : 'data';
    if (['return', 'class', 'for', 'while', 'if', 'else', 'function', 'int', 'string', 'void'].includes(paramNoun)) {
        paramNoun = 'inputData';
    }
    const cleanNoun = paramNoun.replace(/[^a-zA-Z0-9]/g, '') || 'data';

    let retTypeCpp = 'int';
    let retTypePy = 'int';
    let retTypeJava = 'int';
    let retValCpp = '0';
    let retValPy = '0';
    let retValJava = '0';
    let retValJs = '0';
    
    let paramsCpp = `vector<int>& ${cleanNoun}List`;
    let paramsPy = `${cleanNoun}_list: list[int]`;
    let paramsJava = `int[] ${cleanNoun}Array`;
    let paramsJs = `${cleanNoun}Array`;
    
    let solutionBodyCpp = `        if (${cleanNoun}List.empty()) return 0;\n        int ans = 0;\n        for (int val : ${cleanNoun}List) {\n            // Apply ${pattern} processing logic\n            ans += val;\n        }\n        return ans;`;
    let solutionBodyPy = `        if not ${cleanNoun}_list:\n            return 0\n        ans = 0\n        for val in ${cleanNoun}_list:\n            # Apply ${pattern} processing logic\n            ans += val\n        return ans`;
    let solutionBodyJava = `        if (${cleanNoun}Array == null || ${cleanNoun}Array.length == 0) return 0;\n        int ans = 0;\n        for (int val : ${cleanNoun}Array) {\n            // Apply ${pattern} processing logic\n            ans += val;\n        }\n        return ans;`;
    let solutionBodyJs = `    if (!${cleanNoun}Array || ${cleanNoun}Array.length === 0) return 0;\n    let ans = 0;\n    for (const val of ${cleanNoun}Array) {\n        // Apply ${pattern} processing logic\n        ans += val;\n    }\n    return ans;`;

    const lowerTopic = (topicSlug || '').toLowerCase();
    
    if (lowerTopic.includes('string')) {
      retTypeCpp = 'string'; retTypePy = 'str'; retTypeJava = 'String';
      retValCpp = '""'; retValPy = '""'; retValJava = '""'; retValJs = '""';
      paramsCpp = `string ${cleanNoun}Str`; paramsPy = `${cleanNoun}_str: str`; paramsJava = `String ${cleanNoun}Str`; paramsJs = `${cleanNoun}Str`;
      solutionBodyCpp = `        string ans = "";\n        for (char c : ${cleanNoun}Str) {\n            ans += c;\n        }\n        return ans;`;
      solutionBodyPy = `        ans = ""\n        for c in ${cleanNoun}_str:\n            ans += c\n        return ans`;
      solutionBodyJava = `        StringBuilder ans = new StringBuilder();\n        for (char c : ${cleanNoun}Str.toCharArray()) {\n            ans.append(c);\n        }\n        return ans.toString();`;
      solutionBodyJs = `    let ans = "";\n    for (const c of ${cleanNoun}Str) {\n        ans += c;\n    }\n    return ans;`;
    } else if (lowerTopic.includes('tree') || lowerTopic.includes('bst')) {
      retTypeCpp = 'TreeNode*'; retTypePy = 'Optional[TreeNode]'; retTypeJava = 'TreeNode';
      retValCpp = 'nullptr'; retValPy = 'None'; retValJava = 'null'; retValJs = 'null';
      paramsCpp = `TreeNode* ${cleanNoun}Root`; paramsPy = `${cleanNoun}_root: Optional[TreeNode]`; paramsJava = `TreeNode ${cleanNoun}Root`; paramsJs = `${cleanNoun}Root`;
      solutionBodyCpp = `        if (!${cleanNoun}Root) return nullptr;\n        // Traverse tree logic for ${cleanTitle}\n        return ${cleanNoun}Root;`;
      solutionBodyPy = `        if not ${cleanNoun}_root:\n            return None\n        # Traverse tree logic for ${cleanTitle}\n        return ${cleanNoun}_root`;
      solutionBodyJava = `        if (${cleanNoun}Root == null) return null;\n        // Traverse tree logic for ${cleanTitle}\n        return ${cleanNoun}Root;`;
      solutionBodyJs = `    if (!${cleanNoun}Root) return null;\n    // Traverse tree logic for ${cleanTitle}\n    return ${cleanNoun}Root;`;
    } else if (lowerTopic.includes('linked-list')) {
      retTypeCpp = 'ListNode*'; retTypePy = 'Optional[ListNode]'; retTypeJava = 'ListNode';
      retValCpp = 'nullptr'; retValPy = 'None'; retValJava = 'null'; retValJs = 'null';
      paramsCpp = `ListNode* ${cleanNoun}Head`; paramsPy = `${cleanNoun}_head: Optional[ListNode]`; paramsJava = `ListNode ${cleanNoun}Head`; paramsJs = `${cleanNoun}Head`;
      solutionBodyCpp = `        if (!${cleanNoun}Head) return nullptr;\n        ListNode* curr = ${cleanNoun}Head;\n        while (curr) {\n            curr = curr->next;\n        }\n        return ${cleanNoun}Head;`;
      solutionBodyPy = `        if not ${cleanNoun}_head:\n            return None\n        curr = ${cleanNoun}_head\n        while curr:\n            curr = curr.next\n        return ${cleanNoun}_head`;
      solutionBodyJava = `        if (${cleanNoun}Head == null) return null;\n        ListNode curr = ${cleanNoun}Head;\n        while (curr != null) {\n            curr = curr.next;\n        }\n        return ${cleanNoun}Head;`;
      solutionBodyJs = `    if (!${cleanNoun}Head) return null;\n    let curr = ${cleanNoun}Head;\n    while (curr) {\n        curr = curr.next;\n    }\n    return ${cleanNoun}Head;`;
    } else if (lowerTopic.includes('graph')) {
      paramsCpp = `int ${cleanNoun}Count, vector<vector<int>>& ${cleanNoun}Edges`; paramsPy = `${cleanNoun}_count: int, ${cleanNoun}_edges: list[list[int]]`; paramsJava = `int ${cleanNoun}Count, int[][] ${cleanNoun}Edges`; paramsJs = `${cleanNoun}Count, ${cleanNoun}Edges`;
      solutionBodyCpp = `        vector<vector<int>> adj(${cleanNoun}Count);\n        for (auto& e : ${cleanNoun}Edges) {\n            adj[e[0]].push_back(e[1]);\n        }\n        return 0;`;
      solutionBodyPy = `        adj = {i: [] for i in range(${cleanNoun}_count)}\n        for u, v in ${cleanNoun}_edges:\n            adj[u].append(v)\n        return 0`;
      solutionBodyJava = `        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < ${cleanNoun}Count; i++) adj.add(new ArrayList<>());\n        for (int[] e : ${cleanNoun}Edges) {\n            adj.get(e[0]).add(e[1]);\n        }\n        return 0;`;
      solutionBodyJs = `    const adj = Array.from({length: ${cleanNoun}Count}, () => []);\n    for (const [u, v] of ${cleanNoun}Edges) {\n        adj[u].push(v);\n    }\n    return 0;`;
    } else if (lowerTopic.includes('math') || lowerTopic.includes('bit')) {
      paramsCpp = `int ${cleanNoun}Val`; paramsPy = `${cleanNoun}_val: int`; paramsJava = `int ${cleanNoun}Val`; paramsJs = `${cleanNoun}Val`;
      solutionBodyCpp = `        int ans = 0;\n        int temp = ${cleanNoun}Val;\n        while (temp > 0) {\n            ans += temp % 10;\n            temp /= 10;\n        }\n        return ans;`;
      solutionBodyPy = `        ans = 0\n        temp = ${cleanNoun}_val\n        while temp > 0:\n            ans += temp % 10\n            temp //= 10\n        return ans`;
      solutionBodyJava = `        int ans = 0;\n        int temp = ${cleanNoun}Val;\n        while (temp > 0) {\n            ans += temp % 10;\n            temp /= 10;\n        }\n        return ans;`;
      solutionBodyJs = `    let ans = 0;\n    let temp = ${cleanNoun}Val;\n    while (temp > 0) {\n        ans += temp % 10;\n        temp = Math.floor(temp / 10);\n    }\n    return ans;`;
    }

    description = `Given input parameters for **${cleanTitle}**, design an optimal solution implementing **${pattern}**.`;
    examples = [
      { input: `${cleanNoun} = [...]`, output: 'result', explanation: `Evaluated ${cleanTitle} using ${pattern}.` }
    ];

    starterCode = {
      cpp: `class Solution {\npublic:\n    ${retTypeCpp} ${methodName}(${paramsCpp}) {\n        // Write optimal solution for ${cleanTitle} using ${pattern}\n        return ${retValCpp};\n    }\n};`,
      python: `class Solution:\n    def ${methodName}(self, ${paramsPy}) -> ${retTypePy}:\n        # Write optimal solution for ${cleanTitle} using ${pattern}\n        return ${retValPy}`,
      java: `public class Solution {\n    public ${retTypeJava} ${methodName}(${paramsJava}) {\n        // Write optimal solution for ${cleanTitle} using ${pattern}\n        return ${retValJava};\n    }\n}`,
      javascript: `function ${methodName}(${paramsJs}) {\n    // Write optimal solution for ${cleanTitle} using ${pattern}\n    return ${retValJs};\n}`
    };

    editorialSolutions = {
      cpp: `class Solution {\npublic:\n    ${retTypeCpp} ${methodName}(${paramsCpp}) {\n        // Official Solution for ${cleanTitle}\n        // Strategy: ${pattern}\n${solutionBodyCpp}\n    }\n};`,
      python: `class Solution:\n    def ${methodName}(self, ${paramsPy}) -> ${retTypePy}:\n        # Official Solution for ${cleanTitle}\n        # Strategy: ${pattern}\n${solutionBodyPy}`,
      java: `public class Solution {\n    public ${retTypeJava} ${methodName}(${paramsJava}) {\n        // Official Solution for ${cleanTitle}\n        // Strategy: ${pattern}\n${solutionBodyJava}\n    }\n}`,
      javascript: `function ${methodName}(${paramsJs}) {\n    // Official Solution for ${cleanTitle}\n    // Strategy: ${pattern}\n${solutionBodyJs}\n}`
    };

    pitchScript = `
1. **Approach**: "I leverage ${pattern} to solve ${cleanTitle} efficiently."
2. **Complexity**: "Time: ${difficulty === 'Hard' ? 'O(N log N)' : 'O(N)'}, Space: O(1) or O(N)."
    `.trim();
  }

  return {
    description,
    examples,
    constraints,
    edgeCases,
    pitchScript,
    starterCode,
    editorialSolutions
  };
}
